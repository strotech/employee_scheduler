const util = require('util')
var path=require('path')
var {fetchData,writeData} = require('./data_functions')
var {inputDataPreprocessor} = require('./preprocessors')
var {scheduleToShift} = require('./business_functions')
var {shiftValidator,employeeCountValidator} = require('./validators')
var {createEmployeeGlobalArray,createShiftGlobalArray} = require('./common_actions')
var filePath = path.resolve(__dirname,'data/AbsenceRecords.xlsx')
var rules=require('./data/rules.json')

const monthlyRoster = fetchData(filePath)
shiftValidator(monthlyRoster)
var monthlyEmployeeGlobalArray = createEmployeeGlobalArray(monthlyRoster)
const preprocessedData = inputDataPreprocessor(monthlyRoster)

const monthOutput = scheduleToShift(preprocessedData,monthlyEmployeeGlobalArray,monthlyRoster)


//console.log(util.inspect(monthOutput[0], false, null, true /* enable colors */))
//console.log(util.inspect(monthlyRoster[0], false, null, true /* enable colors */))

//console.log(monthlyRoster[0])
//console.log(preprocessedData[0])
//console.log(monthlyEmployeeGlobalArray[0])
//console.log(JSON.stringify(monthlyEmployeeGlobalArray))

writeData(monthOutput)