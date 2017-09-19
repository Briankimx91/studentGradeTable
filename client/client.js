const sgt = new SGT();

function SGT() {
    const self = this;
    let studentArray = [];
    let count = 0;
    let sum;
    const inputIds = ['#studentName', '#course', '#studentGrade'];

    self.init = function() {
        $(document).ready(function(){
            self.eventHandlers();
            self.getDataFromServer();
        })
    };
    self.eventHandlers = function() {
        $(".btn-success").click(self.addClicked);
        $('.btn-default').click(self.cancelClicked);
        $(".btn-primary").click(self.getDataFromServer);

    };
    self.cancelClicked = function () {
        self.clearAddStudentForm();
    };
    self.addClicked = function() {
        self.addStudent();
        self.clearAddStudentForm();
    };
    self.addStudent = function() {
        const name = $(inputIds[0]).val();
        const course = $(inputIds[1]).val();
        const grade = $(inputIds[2]).val();
        const studentObj = {};
        studentObj.id = studentArray.indexOf(studentObj);
        studentObj.name = name;
        studentObj.course = course;
        studentObj.grade = grade;
        if(name.length > 0 && course.length > 0 && grade.length > 0){
            studentArray.push(studentObj);
            self.addStudentToDom(studentObj);
            self.calculateAverage(studentObj);
            self.createStudentToServer(name, course, grade);
        }
    };
    self.clearAddStudentForm = function() {
        $(inputIds[0]).val('');
        $(inputIds[1]).val('');
        $(inputIds[2]).val('');
    };
    self.calculateAverage = function(studentArray) {
        sum = 0;
        for(let i = 0; i < studentArray.length; i++){
            sum += Number(studentArray[i].grade);
        }
        let avg = Math.round((sum / studentArray.length) * 100) / 100;
        if(studentArray.length <= 0){
            avg = 0;
        }
        if(typeof avg !== "number" || Number.isNaN(avg)){
        } else {
            self.updateData(avg);
            return avg;
        }
    };
    self.updateData = function(avg) {
        $('.avgGrade').text(avg + "%");
    };
    self.updateStudentList = function() {
        $('tbody').empty();

        for(let i = 0; i < studentArray.length; i++){
            self.addStudentToDom(studentArray[i]);
            self.calculateAverage(studentArray);
        }
    };
    self.addStudentToDom = function(student) {
        const id = student.id;
        let tRow = $('<tr>');
        let tName = $('<td>').text(student.name);
        let tCourse = $('<td>').text(student.course);
        let tGrade = $('<td>').text(student.grade);
        let tDelete = $('<td>').attr({
            "type" : 'button',
            "id": id,
            'class': 'btn btn-danger'
        }).text("Delete");
        $(tRow).append(tName, tCourse, tGrade, tDelete);
        $('tbody').append(tRow);
        $(tRow).on('click', tDelete, self.deleteStudent);
        return student;
    };
    self.deleteStudent = function() {
        const deletedRow = $(self).index();
        const spliceself = studentArray.splice(deletedRow, 1);
        $(self).closest('tr').remove();
        self.deleteStudentFromServer(spliceself[0]);
        self.calculateAverage();
    };
    self.reset = function() {
        studentArray = [];
    };
    self.getDataFromServer = function(){
        $.ajax({
            dataType: 'json',
            method: 'POST',
            data: {api_key: "s1c9c8wE9F"},
            url: 'http://s-apis.learningfuze.com/sgt/get',

            success: function(result){
                self.reset();
                studentArray = result.data;
                console.log("success",result.data);
                self.updateStudentList(studentArray);
            },
            error: function(errr) {
                console.log("There was an error");
            }
        });
    };
    self.createStudentToServer = function(name,course,grade){
        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/create',
            data: {api_key: "s1c9c8wE9F",
                name: name,
                course: course,
                grade: grade
            },
            success: function(result){
                studentArray[studentArray.length - 1].id = result.id;
            },
            error: function(err) {
                console.log("There was an error");
            },
        });
    };
    self.deleteStudentFromServer = function(student){
        $.ajax({
            method: "POST",
            url: "http://s-apis.learningfuze.com/sgt/delete",
            data: {api_key: "s1c9c8wE9F",
                student_id: student.id
            },
            success: function(result){
                console.log(result);
                console.log("delete from server")
            },
            error: function(err){
                console.log("error");
            }

        })
    };
    self.init();
}