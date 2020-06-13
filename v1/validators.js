function checkShiftCount(employeeData){
    var totalAvailability=0
    for(var i=0;i<7;i++){
        totalAvailability+=employeeData.employeeAvailability[i].shift1+employeeData.employeeAvailability[i].shift2+employeeData.employeeAvailability[i].shift3
    }
    if(totalAvailability<5){
        var shortage=5-totalAvailability
        console.log(employeeData.employeeName + " (Id: "+employeeData.employeeId+") is short of minimum availability by "+shortage+" day(s)")
    }
}

const shiftValidator = (monthlyRoster)=>{
    monthlyRoster.forEach(function(week){
        week.employeesData.forEach(function(employee){
            checkShiftCount(employee)
        })
    })
}



exports.shiftValidator = shiftValidator
