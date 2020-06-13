
const createEmployeeGlobalArray = (monthlyRoster)=>{
    var employeeGlobalArray=[]
    var monthlyEmployeeGlobalArray=[]
    for(var i=0;i<monthlyRoster[0].employeesData.length;i++){
        var employeeGlobal={
            employeeId:monthlyRoster[0].employeesData[i].employeeId,
            employeeName:monthlyRoster[0].employeesData[i].employeeName,
            employeeClass:monthlyRoster[0].employeesData[i].employeeClass,
            resourceWeeklyAvailability:0,
            shiftAvailability:Array(7).fill(true)
        }
        employeeGlobalArray.push(employeeGlobal)
    }    
    for(var i=0;i<monthlyRoster.length;i++){
        monthlyEmployeeGlobalArray.push(employeeGlobalArray)
    }
    return JSON.parse(JSON.stringify(monthlyEmployeeGlobalArray))
}

const createShiftGlobalArray = ()=>{
    
    var dailyShiftFillObj=Array(3).fill(0)
    var weeklyShiftFillObj=Array(7).fill(dailyShiftFillObj)
    var monthlyShiftFillObj=Array(4).fill(weeklyShiftFillObj)

    return monthlyShiftFillObj
}

const countEmployeesOfSpecificClass=(data)=>{
    var res = data.reduce(function(accumulator, currentVal) {
        accumulator[currentVal.class] = (accumulator[currentVal.class] || 0) + 1;
        return accumulator;
      }, {})
    return res
}

const rejectBasedOnForecast = (id,empGlobalArray,preprocessedData,wk,day) =>{

    // let tentativeEmpGlobalArray=[...empGlobalArray]
    let tentativeEmpGlobalArray=JSON.parse(JSON.stringify(empGlobalArray))

    let mappedTentativeGlobalArray = tentativeEmpGlobalArray[wk].map(emp=>{
        if(id==emp.employeeId){
            
            emp.resourceWeeklyAvailability+=1
            emp.shiftAvailability[day]=false

        }
        return emp
    })
    
    var rejectFlag=false
    for(let i=day+1;i<7;i++){
        

        let s1c1empl = preprocessedData[wk][i].filter(emp=>emp.employeeAvailability.shift1===1 && emp.employeeClass===1 )
        let s1c1emplAvl = s1c1empl.filter(s1c1e=>empGlobalArray[wk].filter(eg=>eg.employeeId===s1c1e.employeeId)[0].shiftAvailability[i]===true)
        let s2c1empl = preprocessedData[wk][i].filter(emp=>emp.employeeAvailability.shift2===1 && emp.employeeClass===1 )
        let s2c1emplAvl = s2c1empl.filter(s2c1e=>empGlobalArray[wk].filter(eg=>eg.employeeId===s2c1e.employeeId)[0].shiftAvailability[i]===true)
        let s3c1empl = preprocessedData[wk][i].filter(emp=>emp.employeeAvailability.shift3===1 && emp.employeeClass===1 )
        let s3c1emplAvl = s3c1empl.filter(s3c1e=>empGlobalArray[wk].filter(eg=>eg.employeeId===s3c1e.employeeId)[0].shiftAvailability[i]===true)

        let s1c1emplT = preprocessedData[wk][i].filter(emp=>emp.employeeAvailability.shift1===1 && emp.employeeClass===1 )
        let s1c1emplAvlT = s1c1emplT.filter(s1c1e=>mappedTentativeGlobalArray.filter(eg=>eg.employeeId===s1c1e.employeeId)[0].shiftAvailability[i]===true)
        let s2c1emplT = preprocessedData[wk][i].filter(emp=>emp.employeeAvailability.shift2===1 && emp.employeeClass===1 )
        let s2c1emplAvlT = s2c1emplT.filter(s2c1e=>mappedTentativeGlobalArray.filter(eg=>eg.employeeId===s2c1e.employeeId)[0].shiftAvailability[i]===true)
        let s3c1emplT = preprocessedData[wk][i].filter(emp=>emp.employeeAvailability.shift3===1 && emp.employeeClass===1 )
        let s3c1emplAvlT = s3c1emplT.filter(s3c1e=>mappedTentativeGlobalArray.filter(eg=>eg.employeeId===s3c1e.employeeId)[0].shiftAvailability[i]===true)

        

        if(s1c1emplAvl.length!==0 && s1c1emplAvlT.length===0 || s2c1emplAvl.length!==0 && s2c1emplAvlT.length===0 || s3c1emplAvl.length!==0 && s3c1emplAvlT.length===0){
            rejectFlag=true
        }
        
    }
    return rejectFlag

}



exports.createEmployeeGlobalArray=createEmployeeGlobalArray
exports.createShiftGlobalArray=createShiftGlobalArray
exports.countEmployeesOfSpecificClass=countEmployeesOfSpecificClass
exports.rejectBasedOnForecast = rejectBasedOnForecast
