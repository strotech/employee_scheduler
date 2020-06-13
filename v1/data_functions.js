var XLSX = require('xlsx');
const fs = require('fs')


const fetchData = (file)=>{
    var workbook = XLSX.readFile(file);
    var sheet_name_list = workbook.SheetNames;

    var monthlyRoster=[]
    sheet_name_list.forEach(function(sheetName) {
        var worksheet=workbook.Sheets[sheetName]
        //Skipping 2 rows - start
        var range= XLSX.utils.decode_range(worksheet['!ref'])
        range.s.r+= 2;
        if(range.s.r >= range.e.r) range.s.r = range.e.r;
        worksheet['!ref'] = XLSX.utils.encode_range(range);
        //Skipping 2 rows - end

        function shiftData(ws,rowIndex,colIndex){
            return (typeof ws[XLSX.utils.encode_cell({r: rowIndex, c: 3+colIndex})] !== 'undefined') && ws[XLSX.utils.encode_cell({r: rowIndex, c: 3+colIndex})].v.toUpperCase()=='X'?0:1
        }


        var employeesData=[]

        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
            const employeeId = worksheet[XLSX.utils.encode_cell({r: rowNum, c: 0})].v;
            const employeeName = worksheet[XLSX.utils.encode_cell({r: rowNum, c: 1})].v;
            const employeeClass = worksheet[XLSX.utils.encode_cell({r: rowNum, c: 2})].v;

            

            var employee={
                employeeId,
                employeeName,
                employeeClass,
                employeeAvailability:[
                    {
                        shift1:shiftData(worksheet,rowNum,0),
                        shift2:shiftData(worksheet,rowNum,1),
                        shift3:shiftData(worksheet,rowNum,2)
                    },
                    {
                        shift1:shiftData(worksheet,rowNum,3),
                        shift2:shiftData(worksheet,rowNum,4),
                        shift3:shiftData(worksheet,rowNum,5)
                    },
                    {
                        shift1:shiftData(worksheet,rowNum,6),
                        shift2:shiftData(worksheet,rowNum,7),
                        shift3:shiftData(worksheet,rowNum,8)
                    },
                    {
                        shift1:shiftData(worksheet,rowNum,9),
                        shift2:shiftData(worksheet,rowNum,10),
                        shift3:shiftData(worksheet,rowNum,11)
                    },
                    {
                        shift1:shiftData(worksheet,rowNum,12),
                        shift2:shiftData(worksheet,rowNum,13),
                        shift3:shiftData(worksheet,rowNum,14)
                    },
                    {
                        shift1:shiftData(worksheet,rowNum,15),
                        shift2:shiftData(worksheet,rowNum,16),
                        shift3:shiftData(worksheet,rowNum,17)
                    },
                    {
                        shift1:shiftData(worksheet,rowNum,18),
                        shift2:shiftData(worksheet,rowNum,19),
                        shift3:shiftData(worksheet,rowNum,20)
                    }
                ]
            }
            employeesData.push(employee)
        }

        
        var weekObject={
            week: sheetName,
            employeesData:employeesData
        }
        monthlyRoster.push(weekObject)
    })
    return monthlyRoster
}

const daySwitch=(index)=>{
    switch (index){
        case 0:
            return "Sunday"
        case 1:
            return "Monday"
        case 2:
            return "Tuesday"
        case 3:
            return "Wednesday"
        case 4:
            return "Thursday"
        case 5:
            return "Friday"
        case 6:
            return "Saturday"
    }
}

const writeData =(data) =>{
    
    try {
        fs.unlinkSync('output/Schedule.txt')
    } catch(err) {
        console.log("Files deleted")
    }
    var monthDataText=""
    
    data.forEach(function(weekData,wk){

        monthDataText+="====================================================\n"
        monthDataText+=`                     Week ${wk+1}                     \n`
        monthDataText+="====================================================\n"

        weekData.forEach(function(dayData,dayIndex){
            monthDataText+="=====================\n"
            monthDataText+=daySwitch(dayIndex)+"\n"
            monthDataText+="=====================\n"
            dayData.forEach(function(shiftData,shiftIndex){
                monthDataText+=`Shift ${shiftIndex+1} \n`
                monthDataText+="----------\n"
                shiftData.forEach(function(empData){
                    monthDataText+=JSON.stringify(empData)+"\n"
                })
                monthDataText+="----------\n"
            })
        })  
    })

    fs.writeFile('output/Schedule.txt',monthDataText, function (err) {
        if (err) return console.log(err);
    })  
    
    console.log("File has been created")
}


exports.fetchData=fetchData
exports.writeData=writeData
