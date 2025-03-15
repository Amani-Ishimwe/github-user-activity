const {Command} = require('commander');
const program = new Command();
const https = require('https')

//describing the app on my terminal
program
.name('Github-fetcher')
.description('A simple app that fetches user activity on github')
.version('1.0.0')


//command to get the events
program
.command('view <username>')
.description('To fetch all the user activity')
.action((username) => {
    const url = `https://api.github.com/users/${username}/events`;
   // const token = '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';

    const options ={
        header:{
            'User-Agent':'node-js',
            //'Authorization': `token ${token}`
        }
    }

    //sending request
    https.get(url,options,(res) =>{
        let data ='';
      if(res.statusCode !== 200){
        console.error(`Error: ${res.statusCode} - ${res.statusMessage}`);
        return;
      }
      // adding an event listener when data is got
      res.on('data',(chunk)=>{
        data += chunk
      })

// what will happen once all the data is received
res.on('end',()=>{
    
     try{
        const activity = JSON.parse(data)

        if(activity.length === 0){
            console.log("He has not interacted with github so far");
            return;
        }

        //limiting the user activity to 5 only
        console.log("The user has now interacted with github in the following ways : ");
        activity.slice(0,5).forEach((event,index)=>{
            console.log(`${index + 1}. ${event.type} at ${event.repo.name}`);
        })

     }catch(err){
        console.error('Error parsing JSON:',error.message);
     }
    })
    }).on('error',(err) =>{
        console.error('Request failed:', err.message);
    })
})

//to make the programm run
program.parse(process.argv);