var rules=require('./data/rules.json')
var {rejectBasedOnForecast,countEmployeesOfSpecificClass} =require('./common_actions')

const packToFirstAndThirdShift=(minimumOutput,MEGA,MR)=>{
    var packedOutput=minimumOutput
    MEGA.forEach(function(MEGAperWeek,wkIndex){
        var remToBeDeployed=MEGAperWeek.filter(emp=>emp.shiftAvailability.filter(function(value){return value===false}).length<5)
        remToBeDeployed.forEach(function(emp){
            var empId=emp.employeeId;
            let revEmp=JSON.parse(JSON.stringify(emp.shiftAvailability)).reverse()
            revEmp.forEach(function(dayAvailability,dayIn){
                let dayIndex=6-dayIn
                if(dayAvailability===true){   
                    if(MR[wkIndex].employeesData.filter(emp=>emp.employeeId===empId)[0].employeeAvailability[dayIndex].shift1===1 && MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability.filter(function(value){return value===false}).length<5 && minimumOutput[wkIndex][dayIndex][0].length < rules.maxNumForS1andS3){
                        minimumOutput[wkIndex][dayIndex][0].push({id:empId,name:emp.employeeName,class:emp.employeeClass})
                        MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability[dayIndex]=false
                        return
                    }
                    if(MR[wkIndex].employeesData.filter(emp=>emp.employeeId===empId)[0].employeeAvailability[dayIndex].shift3===1 && MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability.filter(function(value){return value===false}).length<5 && minimumOutput[wkIndex][dayIndex][2].length < rules.maxNumForS1andS3){
                        minimumOutput[wkIndex][dayIndex][2].push({id:empId,name:emp.employeeName,class:emp.employeeClass})
                        MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability[dayIndex]=false
                        return
                    }
                    // if(MR[wkIndex].employeesData.filter(emp=>emp.employeeId===empId)[0].employeeAvailability[dayIndex].shift2===1 && MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability.filter(function(value){return value===false}).length<5 ){
                    //     minimumOutput[wkIndex][dayIndex][1].push({id:empId,name:emp.employeeName,class:emp.employeeClass})
                    //     MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability[dayIndex]=false
                    //     return
                    // }
                }
            })
        })
    })
    // return packedOutput
    return minimumOutput
}

const packToSecondAndOtherShift=(minimumOutput,MEGA,MR)=>{
    var packedOutput=minimumOutput
    MEGA.forEach(function(MEGAperWeek,wkIndex){
        var remToBeDeployed=MEGAperWeek.filter(emp=>emp.shiftAvailability.filter(function(value){return value===false}).length<5)
        remToBeDeployed.forEach(function(emp){
            var empId=emp.employeeId;
            let revEmp=JSON.parse(JSON.stringify(emp.shiftAvailability)).reverse()
            revEmp.forEach(function(dayAvailability,dayIn){
                let dayIndex=6-dayIn
                if(dayAvailability===true){   
                    if(MR[wkIndex].employeesData.filter(emp=>emp.employeeId===empId)[0].employeeAvailability[dayIndex].shift2===1 && MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability.filter(function(value){return value===false}).length<5 ){
                        minimumOutput[wkIndex][dayIndex][1].push({id:empId,name:emp.employeeName,class:emp.employeeClass})
                        MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability[dayIndex]=false
                        return
                    }
                    if(MR[wkIndex].employeesData.filter(emp=>emp.employeeId===empId)[0].employeeAvailability[dayIndex].shift3===1 && MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability.filter(function(value){return value===false}).length<5 ){
                        minimumOutput[wkIndex][dayIndex][2].push({id:empId,name:emp.employeeName,class:emp.employeeClass})
                        MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability[dayIndex]=false
                        return
                    }
                    if(MR[wkIndex].employeesData.filter(emp=>emp.employeeId===empId)[0].employeeAvailability[dayIndex].shift1===1 && MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability.filter(function(value){return value===false}).length<5 ){
                        minimumOutput[wkIndex][dayIndex][0].push({id:empId,name:emp.employeeName,class:emp.employeeClass})
                        MEGA[wkIndex].filter(e=>e.employeeId===empId)[0].shiftAvailability[dayIndex]=false
                        return
                    }
                }
            })
        })
    })
    // return packedOutput
    return minimumOutput
}

const scheduleToShift =(preprocessedData,monthlyEmployeeGlobalArray,monthlyRoster) =>{
    var monthOutput=[]
    preprocessedData.forEach(function(week,wkIndex){
        var weekOutput=[]
        week.forEach(function(day,dayIndex){
            var dayOutput=[]
            var shift1Output=[]
            var shift2Output=[]
            var shift3Output=[]
            day.forEach(function(employeesForDay,empIndex){        
                var employeeGlobalObjectIndex = monthlyEmployeeGlobalArray[wkIndex].findIndex(emp=> emp.employeeId == employeesForDay.employeeId);
                var employeeGlobalObject=monthlyEmployeeGlobalArray[wkIndex][employeeGlobalObjectIndex]
                if( shift1Output.length<(rules.minNumOfClass1ForS1+rules.minNumOfClass2ForS1+rules.minNumOfClass3ForS1) && employeesForDay.employeeAvailability.shift1==1 && employeeGlobalObject.shiftAvailability.filter(function(value){return value===false}).length<5 && employeeGlobalObject.shiftAvailability[dayIndex]===true){
                   // if(!rejectBasedOnForecast(employeesForDay.employeeId,monthlyEmployeeGlobalArray,preprocessedData,wkIndex,dayIndex)){
                        if( (employeesForDay.employeeClass===1 && (countEmployeesOfSpecificClass(shift1Output)['1']?countEmployeesOfSpecificClass(shift1Output)['1']:0)<rules.minNumOfClass1ForS1) ){
                            shift1Output.push({id:employeeGlobalObject.employeeId,name:employeeGlobalObject.employeeName,class:employeeGlobalObject.employeeClass})
                            employeeGlobalObject.resourceWeeklyAvailability+=1
                            employeeGlobalObject.shiftAvailability[dayIndex]=false
                        }   
                        if( (employeesForDay.employeeClass===2 && (countEmployeesOfSpecificClass(shift1Output)['2']?countEmployeesOfSpecificClass(shift1Output)['2']:0)<rules.minNumOfClass2ForS1) ){
                            shift1Output.push({id:employeeGlobalObject.employeeId,name:employeeGlobalObject.employeeName,class:employeeGlobalObject.employeeClass})
                            employeeGlobalObject.resourceWeeklyAvailability+=1
                            employeeGlobalObject.shiftAvailability[dayIndex]=false
                        }   
                        if( (employeesForDay.employeeClass===3 && (countEmployeesOfSpecificClass(shift1Output)['3']?countEmployeesOfSpecificClass(shift1Output)['3']:0)<rules.minNumOfClass3ForS1) ){
                            shift1Output.push({id:employeeGlobalObject.employeeId,name:employeeGlobalObject.employeeName,class:employeeGlobalObject.employeeClass})
                            employeeGlobalObject.resourceWeeklyAvailability+=1
                            employeeGlobalObject.shiftAvailability[dayIndex]=false
                        }   
                           
                   // }              
                }
                if(shift2Output.length<(rules.minNumOfClass1ForS2+rules.minNumOfClass2ForS2+rules.minNumOfClass3ForS2) && employeesForDay.employeeAvailability.shift2==1 && employeeGlobalObject.shiftAvailability.filter(function(value){return value===false}).length<5 && employeeGlobalObject.shiftAvailability[dayIndex]==true){

                    //if(!rejectBasedOnForecast(employeesForDay.employeeId,monthlyEmployeeGlobalArray,preprocessedData,wkIndex,dayIndex)){
                        if( (employeesForDay.employeeClass===1 && (countEmployeesOfSpecificClass(shift2Output)['1']?countEmployeesOfSpecificClass(shift2Output)['1']:0)<rules.minNumOfClass1ForS2) ){
                            shift2Output.push({id:employeeGlobalObject.employeeId,name:employeeGlobalObject.employeeName,class:employeeGlobalObject.employeeClass})
                            employeeGlobalObject.resourceWeeklyAvailability+=1
                            employeeGlobalObject.shiftAvailability[dayIndex]=false
                        }  
                        if( (employeesForDay.employeeClass===2 && (countEmployeesOfSpecificClass(shift2Output)['2']?countEmployeesOfSpecificClass(shift2Output)['2']:0)<rules.minNumOfClass2ForS2) ){
                            shift2Output.push({id:employeeGlobalObject.employeeId,name:employeeGlobalObject.employeeName,class:employeeGlobalObject.employeeClass})
                            employeeGlobalObject.resourceWeeklyAvailability+=1
                            employeeGlobalObject.shiftAvailability[dayIndex]=false
                        }   
                        if( (employeesForDay.employeeClass===3 && (countEmployeesOfSpecificClass(shift2Output)['3']?countEmployeesOfSpecificClass(shift2Output)['3']:0)<rules.minNumOfClass3ForS2) ){
                            shift2Output.push({id:employeeGlobalObject.employeeId,name:employeeGlobalObject.employeeName,class:employeeGlobalObject.employeeClass})
                            employeeGlobalObject.resourceWeeklyAvailability+=1
                            employeeGlobalObject.shiftAvailability[dayIndex]=false
                        }    
                             
                    //}               
                }
                if(shift3Output.length<(rules.minNumOfClass1ForS3+rules.minNumOfClass2ForS3+rules.minNumOfClass3ForS3) && employeesForDay.employeeAvailability.shift3==1 && employeeGlobalObject.shiftAvailability.filter(function(value){return value===false}).length<5 && employeeGlobalObject.shiftAvailability[dayIndex]==true){

                    //if(!rejectBasedOnForecast(employeesForDay.employeeId,monthlyEmployeeGlobalArray,preprocessedData,wkIndex,dayIndex)){
                        if( (employeesForDay.employeeClass===1 && (countEmployeesOfSpecificClass(shift3Output)['1']?countEmployeesOfSpecificClass(shift3Output)['1']:0)<rules.minNumOfClass1ForS3) ){
                            shift3Output.push({id:employeeGlobalObject.employeeId,name:employeeGlobalObject.employeeName,class:employeeGlobalObject.employeeClass})
                            employeeGlobalObject.resourceWeeklyAvailability+=1
                            employeeGlobalObject.shiftAvailability[dayIndex]=false
                        }     
                        if( (employeesForDay.employeeClass===2 && (countEmployeesOfSpecificClass(shift3Output)['2']?countEmployeesOfSpecificClass(shift3Output)['2']:0)<rules.minNumOfClass2ForS3) ){
                            shift3Output.push({id:employeeGlobalObject.employeeId,name:employeeGlobalObject.employeeName,class:employeeGlobalObject.employeeClass})
                            employeeGlobalObject.resourceWeeklyAvailability+=1
                            employeeGlobalObject.shiftAvailability[dayIndex]=false
                        }   
                        if( (employeesForDay.employeeClass===3 && (countEmployeesOfSpecificClass(shift3Output)['3']?countEmployeesOfSpecificClass(shift3Output)['3']:0)<rules.minNumOfClass3ForS3) ){
                            shift3Output.push({id:employeeGlobalObject.employeeId,name:employeeGlobalObject.employeeName,class:employeeGlobalObject.employeeClass})
                            employeeGlobalObject.resourceWeeklyAvailability+=1
                            employeeGlobalObject.shiftAvailability[dayIndex]=false
                        }   
                         
                    //}               
                }            
            })
            dayOutput.push(shift1Output)
            dayOutput.push(shift2Output)
            dayOutput.push(shift3Output)
            weekOutput.push(dayOutput)
        })
        monthOutput.push(weekOutput)
    })

    // let monthlyRosterReverse=JSON.parse(JSON.stringify(monthlyRoster)).map(weekData=>weekData.employeesData.reverse())
    const midOutput=packToFirstAndThirdShift(monthOutput,monthlyEmployeeGlobalArray,monthlyRoster)
    const finalOutput=packToSecondAndOtherShift(midOutput,monthlyEmployeeGlobalArray,monthlyRoster)

    return finalOutput
   
}

exports.scheduleToShift = scheduleToShift