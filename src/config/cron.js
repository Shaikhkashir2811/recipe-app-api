import cron from "cron";
import https from "https";

const job = new cron.job("*/14 * * * *",function(){
    https.get(process.env.API_URL, (res)=>{
        if(res.statusCode === 200) console.log("Get request sent successfully ");
        else console.log("Failed to send get request ",res.statusCode);
    }).on("error",(e)=> console.error("Error sending get request ",e));
});

export default job; 