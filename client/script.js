// Define all global variables here
var studentArray = []; // student_array - global array to hold student objects @type {Array}
var count = 0; // for giving an id for each array's objects
var inputIds = ['#studentName','#course','#studentGrade'];// inputIds - id's of the elements that are used to add students @type {string[]}

// addClicked - Event Handler when user clicks the add button
function addClicked(){
    addStudent();
    clearAddStudentForm();
}
// cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
function cancelClicked(){
    console.log("cancel clicked");
    clearAddStudentForm();
}
// addStudent - creates a student objects based on input fields in the form and adds the object to global student array @return undefined
function addStudent(){
    var studentObj = {};
    var student_name = $(inputIds[0]).val();
    var student_course = $(inputIds[1]).val();
    var student_grade = $(inputIds[2]).val();
    studentObj.id = studentArray.indexOf(studentObj);
    studentObj.name = student_name;
    studentObj.course = student_course;
    studentObj.grade = student_grade;
    if(student_name.length > 0 && student_course.length > 0 && student_grade.length > 0 ){
        studentArray.push(studentObj);
        addStudentToDom(studentObj);
        calculateAverage(studentObj);
        createStudentToServer(student_name,student_course,student_grade);
    }
}
// clearAddStudentForm - clears out the form values based on inputIds variable
function clearAddStudentForm(){
    $(inputIds[0]).val('');
    $(inputIds[1]).val('');
    $(inputIds[2]).val('');
}
// calculateAverage - loop through the global student array and calculate average grade and return that value @returns {number}
function calculateAverage(sum){
    sum = 0;
    for(var i = 0; i < studentArray.length; i++){
        sum += Number(studentArray[i].grade);
    }
    var avg = Math.round((sum / studentArray.length) * 100) / 100;

    if(studentArray.length <= 0){
        avg = 0;
    }
    if(typeof avg !== "number" || Number.isNaN(avg)){
    } else {
        updateData(avg);
        return avg;
    }

}
// updateData - centralized function to update the average and call student list update
function updateData(avg){
    $(".avgGrade").text(avg + "%");
}
function updateStudentList(studentArray){
    $('tbody').empty();

    for(var i = 0; i < studentArray.length; i++){
        addStudentToDom(studentArray[i]);
        calculateAverage(studentArray);
    }
}
// addStudentToDom - take in a student object, create html elements from the values and then append the elements into the .student_list tbody @param studentObj
function addStudentToDom(studentObj) {
    var identity = studentObj.id;
    var tableRow = $('<tr>');
    var tableName = $('<td>').text(studentObj.name);
    var tableCourse = $('<td>').text(studentObj.course);
    var tableGrade = $('<td>').text(studentObj.grade);
    var tableDelete = $('<td>').attr({
        "type" : 'button',
        "id": identity,
        'class': 'btn btn-danger'
    }).text("Delete");
    $(tableRow).append(tableName, tableCourse, tableGrade, tableDelete);
    $('tbody').append(tableRow);
    $(tableRow).on('click', tableDelete, deleteStudent);
    return studentObj;
}
function deleteStudent(){
    console.log("deleteRow function called");
    var deletedRow = $(this).index();
    var spliceThis = studentArray.splice(deletedRow, 1);
    $(this).closest('tr').remove();
    deleteStudentFromServer(spliceThis[0]);
    calculateAverage();
    console.log(studentArray);
}

// reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
function reset(){
    studentArray = [];
}
// function for the get data from server button
function getDataFromServer(){
    $.ajax({
        dataType: 'json',
        method: 'POST',
        data: {api_key: "s1c9c8wE9F"},
        url: 'http://s-apis.learningfuze.com/sgt/get',

        success: function(result){
            reset();
            studentArray = result.data;
            console.log("success");
            updateStudentList(studentArray);
        },
        error: function(errr) {
            console.log("There was an error");
        }
    });
}
function createStudentToServer(student_name,student_course,student_grade){
    $.ajax({
        dataType: 'json',
        method: 'POST',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        data: {api_key: "s1c9c8wE9F",
            name: student_name,
            course: student_course,
            grade: student_grade
        },
        success: function(result){
            // for(var i = 0; i < studentArray.length; i++){
                studentArray[studentArray.length - 1].id = result.new_id;
            // }
            console.log("created to server");
            console.log(result);
        },
        error: function(errr) {
            console.log("There was an error");
        },
    });
}
function deleteStudentFromServer(studentObj){
    $.ajax({
        method: "POST",
        url: "http://s-apis.learningfuze.com/sgt/delete",
        data: {api_key: "s1c9c8wE9F",
            student_id: studentObj.id
        },
        success: function(result){
            console.log(result);
            console.log("delete from server")
        },
        error: function(err){
          console.log("error");
        }

    })
}
$(document).ready(function(){ // Listen for the document to load and reset the data to the initial state
    $(".btn-success").click(addClicked);
    $(".btn-default").click(cancelClicked);
    $(".btn-primary").click(getDataFromServer);
    // reset();
});

