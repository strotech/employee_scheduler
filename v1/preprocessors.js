const inputDataPreprocessor = (monthlyRoster)=>{
    var monthlyRosterBasedOnWeek=[]
    monthlyRoster.forEach(function(week) {
        var weeklyObject=[]
        for(i=0;i<7;i++){
            var dailyObjectArray=[]
            for(var j=0;j<week.employeesData.length;j++){
                var dailyObject={
                    employeeId              :   week.employeesData[j].employeeId,
                    employeeClass           :   week.employeesData[j].employeeClass,
                    employeeAvailability    :   week.employeesData[j].employeeAvailability[i]
                }  
                dailyObjectArray.push(dailyObject)          
            }
            weeklyObject.push(dailyObjectArray.sort(function(a,b){return a.employeeClass-b.employeeClass}))
        }
        monthlyRosterBasedOnWeek.push(weeklyObject)
    })
    return monthlyRosterBasedOnWeek
}

exports.inputDataPreprocessor=inputDataPreprocessor

