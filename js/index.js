/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var myDB;

 $(document).ready(function(){
//    $("#showTable").hide();



    document.addEventListener("deviceready",onDeviceReady,false);

    function onDeviceReady(){
        var firstrun = window.localStorage.getItem("FirstRun");
        if ( firstrun == null ) {
                window.localStorage.setItem("FirstRun", "1");
                myDB = window.sqlitePlugin.openDatabase({ name: 'volunteer.db', location: 'default' });
                        myDB.transaction(function (tx) {
                            tx.executeSql('CREATE TABLE IF NOT EXISTS `Activity` ( `VolunteerActivityName` TEXT NOT NULL, `VolunteerName` TEXT NOT NULL, `Location` TEXT, `Date` TEXT NOT NULL, `Time` TEXT, `Id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `Description` TEXT )', [], function (tx, result) {
                //            alert("Table created successfully");
                            }, function(error) {
                            alert("Error occurred while creating the table.");
                            });
                            });
                                addItem('Teaching', 'John', 'New York', '10/12/2017', '10:00', '', true);
                                addItem('Summer', 'Alex', 'Alabama', '11/03/2017', '21:00', '', true);
                                addItem('Winter', 'Joe', 'VietNam', '21/03/2017', '11:00', '', true);
                                addItem('ABC', 'Koby', 'Ho Chi Minh', '03/04/2016', '12:00', '', true);
                                addItem('DEF', 'Wayne', 'Ha Noi', '10/12/2017', '08:00', '', true);
                                addItem('Learning', 'Ronaldo', 'Syria', '09/12/2016', '10:00', '', true);
                                addItem('Studying', 'Teddy', 'Iraq', '01/12/2017', '17:00', '', true);

            }
            else {
                // Db Alredy Exists
                myDB = window.sqlitePlugin.openDatabase({ name: 'volunteer.db', location: 'default' });
            }

            $("#showTable").click();
    }


    function addItem(activityName, volunteerName, location, date, time, description, debug) {
            myDB.transaction(function (tx) {
            var query = "INSERT INTO Activity (VolunteerActivityName, VolunteerName, Location, Date, Time, Description) VALUES (?,?,?,?,?,?)";

            tx.executeSql(query, [activityName, volunteerName, location, date, time, description], function(tx, res) {
            if (!debug) {
                alert('Insert successful');
                $("#showTable").click();
            }
            },
            function(tx, error) {
                alert('INSERT error: ' + error.message);
            });
            });
        }

    function searchActivity (keyword) {
//          var myDB = window.sqlitePlugin.openDatabase({ name: 'volunteer.db', location: 'default' });

          var result = null;
          myDB.transaction(function (tx) {
            var query = "SELECT * FROM Activity WHERE VolunteerActivityName LIKE '%" + keyword + "%'";
            tx.executeSql(query, [], function(tx, res) {
                          if(res.rows.length != 0) {
                              result = res.rows;
                          }
                      },
                      function(tx, error) {
                          alert('Search error: ' + error.message);
                      });
          });

          return result;

      }

$("#searchActivityName").submit(function (event) {
//search and redirect to search.html with parameters string
    var keyword = $("#searchActivityName input").first().val();
    var result = searchActivity(keyword);
    alert(result)
    if(result != null) {
        window.localStorage.setItem("result", result);
//        event.preventDefault();
    }
});

$("#insert").click(function(){
  var activityName = $("#activityName").val();
  var volunteerName = $("#volunteerName").val();
  var location = $("#location").val();
  var date = $("#date").val();
  var time = $("#time").val();
  var description = $("#description").val();

//  console.log(title +""+ desc);
  addItem(activityName, volunteerName, location, date, time, description, false)
  $("input").each(function (){
    $(this).val("");
  });
});

$("#showTable").click(function() {
    $("#TableData").html("");
            myDB.transaction(function (tx) {
                    var query = "SELECT * FROM Activity";
                    tx.executeSql(query, [], function(tx, res) {
                        var len = res.rows.length, i;
//                        $("#rowCount").html(len);
                        for (i = 0; i < len; i++){
                                                                $("#TableData").append("<tr><td style='display: none;'>"+res.rows.item(i).Id+"</td><td>"+res.rows.item(i).VolunteerActivityName+"</td><td>"+res.rows.item(i).VolunteerName+"</td><td>"+res.rows.item(i).Location+"</td><td><a href='detail.html?id="+res.rows.item(i).Id+"&activityName="+res.rows.item(i).VolunteerActivityName+"&volunteerName="+res.rows.item(i).VolunteerName+"&location="+res.rows.item(i).Location+"&date="+res.rows.item(i).Date+"&time="+res.rows.item(i).Time+"&description="+res.rows.item(i).Description+"'>Detail</a> </td></tr>");
                                                             }
                    });
                });

    });

     $("#DropTable").click(function(){
         myDB.transaction(function(transaction) {
             var executeQuery = "DROP TABLE  IF EXISTS Activity";
             transaction.executeSql(executeQuery, [],
                 function(tx, result) {alert('Table deleted successfully.');},
                 function(error){alert('Error occurred while droping the table.');}
             );
         });
     });

     $("#update").click(function(){
       var state = $("#update").text();
       if(state == 'Edit') {
        $("input").each(function () {
            $(this).prop("disabled", false);
        });
        $("input")[0].focus();
        $("#update").text("Update")
       }else{
        var id = $("#id").text();
        var activityName = $("#activityName").val();
        var volunteerName = $("#volunteerName").val();
        var location = $("#location").val();
        var date = $("#date").val();
        var time = $("#time").val();
        var description = $("#description").val();

        myDB.transaction(function(transaction) {
          var executeQuery = "UPDATE Activity SET VolunteerActivityName=?, VolunteerName=?, Location=?, Date=?, Time=?, Description=? WHERE Id=?";
         transaction.executeSql(executeQuery, [activityName,volunteerName,location, date, time, description, id],
           //On Success
           function(tx, result) {
               alert('Updated successfully');
           },
           //On Error
           function(error){alert('Update Failed');});
       });

        $("input").each(function () {
          $(this).prop("disabled", true);
        });
        $("#update").text("Edit")
       }

     });

$(document.body).on('click', '.delete' ,function(){
  var id = this.id;
  myDB.transaction(function(transaction) {
    var executeQuery = "DELETE FROM Activity where Id=?";
    transaction.executeSql(executeQuery, [id],
      //On Success
      function(tx, result) {
        alert('Delete successfully');
        window.location = "index.html"
      },
      //On Error
      function(error){alert('Something went Wrong');});
  });
});
 });




