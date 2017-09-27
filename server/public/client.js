const sgt = new SGT();

function SGT() {
    const self = this;
    const inputIds = ['#studentName', '#course', '#studentGrade'];
    let studentArray = [];
    let sum;
    let edit = null;
    let studentData;

    self.init = function() {
        $(document).ready(function(){
            $(".add").click(self.addClicked);
            $('.form-cancel').click(self.clearAddStudentForm);
            $(".get-data").click(self.getDataFromServer);
            $('.done').click(self.sendEditedStudentData);
            self.getDataFromServer();
        });
    };

    self.addClicked = function() {
        self.addStudent();
        self.clearAddStudentForm();
    };

    self.addStudent = function() {
        const studentObj = {};
        const name = $(inputIds[0]).val();
        const course = $(inputIds[1]).val();
        const grade = $(inputIds[2]).val();
        studentObj.name = name;
        studentObj.course = course;
        studentObj.grade = grade;
        if(name.length > 0 && course.length > 0 && grade.length > 0){
            studentArray.push(studentObj);
            studentObj.id = studentArray.indexOf(studentObj);
            self.addStudentToDom(studentObj);
            self.calculateAverage(studentObj);
            self.createStudentToServer(studentObj.id, name, course, grade);
            console.log("studentArray:",studentArray);
        }
    };

    self.clearAddStudentForm = function() {
        $(inputIds[0]).val('');
        $(inputIds[1]).val('');
        $(inputIds[2]).val('');
    };

    self.calculateAverage = function() {
        sum = 0;
        for(let i = 0; i < studentArray.length; i++){
            sum += Number(studentArray[i].grade);
        }
        let avg = Math.round((sum / studentArray.length) * 100) / 100;
        if(studentArray.length === 0){
            avg = 0;
        }
        if(typeof avg !== "number" || Number.isNaN(avg)){
            Number(avg);
        }
        $('.avgGrade').text(avg + "%");
    };

    self.updateStudentList = function() {
        $('.data').empty();
        for(let i = 0; i < studentArray.length; i++){
            self.addStudentToDom(studentArray[i]);
        }
        self.calculateAverage();
    };

    self.addStudentToDom = function(student) {
        const id = student._id;
        let tRow = $('<tr>');
        let tName = $('<td>').addClass("txt").text(student.name);
        let tCourse = $('<td>').addClass("txt").text(student.course);
        let tGrade = $('<td>').addClass("txt").text(student.grade);
        let tDelete = $('<td>').attr({
            "type" : 'button',
            "id": id,
            'class': 'btn btn-danger'
        }).text("Delete");
        let tEdit = $("<td>").attr({
            "type": "button",
            "id":id,
            'class':'btn btn-info editBtn'
        }).text("Edit");
        $(tRow).append(tName, tCourse, tGrade, tEdit, tDelete);
        $('.data').append(tRow);
        tDelete.click(self.deleteStudent);
        tEdit.click(function(){
            self.editStudentData(student);
            $('.modal').modal();
        });
    };

    self.editStudentData = function(student){
        console.log("edit function called");
        console.log(student);
        $('.editName').val(student.name);
        $('.editCourse').val(student.course);
        $('.editGrade').val(student.grade);
        edit = student;
    };

    self.deleteStudent = function() {
        let thisID = $(this)[0].id;
        studentArray.map(function(item, index){
            if(thisID === studentArray[index]._id){
                studentArray.splice(index,1);
            }
        });
        $(this).closest('tr').remove();
        self.deleteStudentFromServer(thisID);
        self.calculateAverage();
        console.log(studentArray);
    };

    self.reset = function() {
        studentArray = [];
    };

    self.getDataFromServer = function(){
        $.ajax({
            dataType: 'json',
            method: 'GET',
            url: '/students',
            success: function(result){
                self.reset();
                studentArray = result.data;
                console.log("success",studentArray);
                self.updateStudentList();
            },
            error: function(errr) {
                console.log("There was an error");
            }
        });
    };

    self.createStudentToServer = function(id,name,course,grade){
        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: '/students',
            data: {
                id:id,
                name: name,
                course: course,
                grade: grade
            },
            success: function(result){
                studentData = result;
                console.log("created to server: ",result);
            },
            error: function(err) {
                console.log("There was an error");
            },
        });
    };

    self.deleteStudentFromServer = function(id){
        $.ajax({
            method: "DELETE",
            url: `/students/${id}`,
            success: function(result){
                console.log("deleted from server",result);
            },
            error: function(err){
                console.log("error");
            }

        })
    };

    self.sendEditedStudentData = function(){
        const id = edit._id;
        const editName = $('.editName').val();
        const editCourse = $('.editCourse').val();
        const editGrade = $('.editGrade').val();
        $.ajax({
            method: "PUT",
            url:`students/${edit._id}`,
            data:{
                name:editName,
                course:editCourse,
                grade:editGrade
            },
            success: function(result){
                console.log("updating worked",result);
            },
            error: function(err){
                console.log("error")
            }
        });

    };

    self.init();
}