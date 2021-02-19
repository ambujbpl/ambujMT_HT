const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
var totalSalary = 0;
var maleTotal = 0;
var femaleTotal = 0;
var basicSalaryAmount = 0;
var totalOverTimeAmount = 0;
var bonusAmount = 0;
app.use(bodyParser.json());
var startDate = new Date("2020-01-31");
var endDate = new Date("2020-02-30");
// Setting up the public directory
app.use(express.static('./../web'));
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../web/index.html'));
  //__dirname : It will resolve to your project folder.
});
app.get('/getData', async (req, res) => {
  totalSalary = 0;
  maleTotal = 0;
  femaleTotal = 0;
  basicSalaryAmount = 0;
  totalOverTimeAmount = 0;
  bonusAmount = 0;
  const {data} = await axios.get('http://34.198.81.140/attendance.json');
  var resultProductData = data.filter(a => {
    var date = new Date(a.date);
    return (date >= startDate && date <= endDate);
  });
  resultProductData.forEach(data => {
    checkTotalHours(data)    
  })
  if(maleTotal> femaleTotal){
    bonusAmount =  (femaleTotal * (1/100))
  } else {
    bonusAmount =  (maleTotal * (1/100))
  }
  totalSalary += bonusAmount;
  res.json({'data':{
    'Basic Salary' : basicSalaryAmount,
    'Overtime' : totalOverTimeAmount,
    'Bonus' :bonusAmount,
    'Total Salary(Male)' :maleTotal,
    'Total Salary(Female)' :femaleTotal,
    'Total Salary' :totalSalary,
  }});
})

checkTotalHours = data => {
  let perHourSalary = data.per_day_salary / 8;
  let currentSalary = 0;
  let overTimeHour = 0;
  if(1 < data.weekday && data.weekday < 7){
    if(data.total_hours >= 8) {
      currentSalary += data.per_day_salary;
      basicSalaryAmount += currentSalary
      if(data.designation.trim().toLowerCase() === "worker"){
        overTimeHour = data.total_hours - 8;
        let overTimeSalary = 2 * overTimeHour * perHourSalary;
        currentSalary += overTimeSalary;
        totalOverTimeAmount += overTimeSalary;
      }
    } else if(data.total_hours >= 4){
      currentSalary += data.per_day_salary / 2;
      basicSalaryAmount += currentSalary
    }
  } else {
    if(data.designation.trim().toLowerCase() === "worker"){
      overTimeHour = data.total_hours;
      let overTimeSalary = 2 * overTimeHour * perHourSalary;
      currentSalary += overTimeSalary;
      totalOverTimeAmount += overTimeSalary;
    }
  }
  if(data.gender.toLowerCase() === "male"){
    maleTotal += currentSalary;
  } else {
    femaleTotal += currentSalary;
  }
  totalSalary += currentSalary
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})