var fs = require('fs');
var path = require('path');  
var url = require('url');    
var express = require('express');
var cons = require('consolidate');   
var cookieParser = require('cookie-parser'); // module for parsing cookies
var app = express();
app.use(cookieParser());   
var users = require('./controllers/user-controller.js');
var auth = require('./controllers/authenticate-controller.js');
var sessionstorage = require('sessionstorage');
var Cookies = require('cookies');
var NodeSession = require('node-session');    

// init
var session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});
//app.set('views', __dirname + '/app/server/views');
//app.set('view engine', 'html');
//console.log(__dirname);
//var app = require('./app');
//var Connection = require('Connection');

//require('./dist/user_data')(Connection);

//var firstParameter = {
//    config: __dirname + resolveURL('/config.json'),
//    logs: __dirname + resolveURL('/logs.json')
//};

require('rtcmulticonnection-server')(null, function (request, response, config, root, BASH_COLORS_HELPER, pushLogs, resolveURL, getJsonFile) {
    try {
        var uri, filename;

        var cookies = new Cookies(request, response, {});




//        MongoClient.connect(mongo_url, function(err, db) {
//          console.log("test user");
//        });

        if (request.url == '/users/logout') {
            console.log("llllllll");
            logout = users.logOut(request, response);

            response.writeHead(302, {
                'Location': '/users/login'
            });
            response.end();
            return;
        }
        if (request.url == '/demos/users/list') {

            mdata = rooms.getUsersList();

//            response.writeHead(200, {
//                 'Content-Type': 'text/plain'
            //});
            mdata = JSON.stringify(mdata);
            response.write(mdata, 'binary');
            response.end();
            return;

        }

        if (request.url.indexOf("users/verify") > -1) {

            authdata = auth.userVerify(request, function (data) {

                response.writeHead(302, {
                    'Location': '/users/login'
                });
                response.write(data.message, 'binary');
                response.end();
                return;
                //response.end();
            });
            return;
        }

        if (request.url == '/users/register') {
            response.writeHead(200, {
                'Content-Type': "application/json; charset=utf-8"
            });

            authdata = auth.register(request, function (data) {

                authdata = JSON.stringify(data);
                response.write(authdata, 'binary');
                response.end();
            });
            return;
        }

        if (request.url == '/users/editprofile') {
            session.startSession(request, response, function () {

                response.writeHead(200, {
                    'Content-Type': "application/json; charset=utf-8"
                });

                if (request.session.get('users') == undefined) {
                    profile_data = JSON.stringify({'status': 0});
                    response.write(profile_data, 'binary');
                    response.end();
                } else {
                    profile = users.edit_profile(request, response, function (data) {
                        profile_data = JSON.stringify(data);
                        response.write(profile_data, 'binary');
                        response.end();

                    });
                }

                return;
            });


            return;
        }
        if (request.url == '/users/update_class') {

            session.startSession(request, response, function () {
                response.writeHead(200, {
                    'Content-Type': "application/json; charset=utf-8"
                });
                if (request.session.get('users') == undefined) {
                    update_data = JSON.stringify({'status': 0});
                    response.write(update_data, 'binary');
                    response.end();
                } else {
                    users.updateClass(request, response, function (data) {
                        update_data = JSON.stringify(data);
                        response.write(update_data, 'binary');
                        response.end();
                    });
                }
            });





            return;
        }
        if (request.url == '/users/changepassword') {
            session.startSession(request, response, function () {
                response.writeHead(200, {
                    'Content-Type': "application/json; charset=utf-8"
                });
                if (request.session.get('users') == undefined) {
                    profile_data = JSON.stringify({'status': 0});
                    response.write(profile_data, 'binary');
                    response.end();
                } else {
                    users.changepassword(request, response, function (data) {
                        pass_data = JSON.stringify(data);
                        response.write(pass_data, 'binary');
                        response.end();
                    });
                }
            });

            return;
        }

        try {
            if (!config.dirPath || !config.dirPath.length) {
                config.dirPath = null;
            }

            uri = url.parse(request.url).pathname;

            filename = path.join(config.dirPath ? resolveURL(config.dirPath) : process.cwd(), uri);

            if (request.url == '/users/signup') {
                session.startSession(request, response, function () {
                    if (request.session.get('users') != undefined) {
                        response.writeHead(302, {
                            'Location': '/users/profile'
                        });
                        response.end();
                        return;
                    } else {
                        filename = filename.replace(resolveURL('/users/signup'), '');
                        filename += resolveURL('/demos/users/register.html');
                        // filename += resolveURL('//users/register.html');

                        fs.readFile(filename, 'binary', function (err, file) {
                            if (err) {
                                response.writeHead(500, {
                                    'Content-Type': 'text/plain'
                                });
                                response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                                response.end();
                                return;
                            }

                            response.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            response.write(file, 'binary');
                            response.end();
                            return;
                        });
                    }
                });
                return;
            }

            if (request.url == '/users/login') {

                session.startSession(request, response, function () {
                    if (request.session.get('users') != undefined) {

                        response.writeHead(302, {
                            'Location': '/users/profile'
                        });
                        response.end();
                        return;
                    } else {

                        if (request.method == 'POST') {
                            response.writeHead(200, {
                                'Content-Type': "application/json; charset=utf-8"
                            });

                            login = auth.login(request, response, function (data) {
                                authdata = JSON.stringify(data);

                                response.write(authdata, 'binary');
                                response.end();
                            });
                            return;
                        } else {

                            filename = filename.replace(resolveURL('/users/login'), '');
                            filename += resolveURL('/demos/users/login.html');

                            fs.readFile(filename, 'binary', function (err, file) {
                                if (err) {
                                    response.writeHead(500, {
                                        'Content-Type': 'text/plain'
                                    });
                                    response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                                    response.end();
                                    return;
                                }

                                response.writeHead(200, {
                                    'Content-Type': 'text/html'
                                });
                                response.write(file, 'binary');
                                response.end();
                                return;
                            });
                        }
                    }
                });
                return;
            }

            if (request.url.indexOf("users/joined_users/list") > -1) {

                users.getClassJoinedList(request, response, function (class_data) {
                    classesdata = JSON.stringify(class_data);
                    response.write(classesdata, 'binary');
                    response.end();
                    return;
                });
                return;
            }

            if (request.url.indexOf("users/save_join_historys") > -1) {

                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        data = JSON.stringify({'status': 0});
                        response.write(data, 'binary');
                        response.end();
                    } else {
                        users.saveJoinHistory(request, response, function (class_data) {
                            classesdata = JSON.stringify(class_data);
                            response.write(classesdata, 'binary');
                            response.end();
                            return;
                        });
                    }
                    return;
                });


                return;
            }

            if (request.url.indexOf("users/recording_save") > -1) {

                users.saveRecording(request, response, function (recording_data) {
                    recording_data = JSON.stringify(recording_data);
                    response.write(recording_data, 'binary');
                    response.end();
                    return;
                });
                return;
            }

            if (request.url.indexOf("users/update_join_history") > -1) {
                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        data = JSON.stringify({'status': 0});
                        response.write(data, 'binary');
                        response.end();
                    } else {
                        users.updateJoinHistory(request, response, function (class_data) {
                            classesdata = JSON.stringify(class_data);
                            response.write(classesdata, 'binary');
                            response.end();
                            return;
                        });
                    }
                    return;
                });

                return;
            }

            if (request.url.indexOf("/users/joined_users") > -1) {

                var filename = filename.replace(resolveURL('/users/joined_users'), '');
                var header_file = resolveURL(filename + '/demos/users/header.html');
                filename += resolveURL('/demos/users/attendees.html');

                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        response.writeHead(302, {
                            'Location': '/users/login'
                        });
                        response.end();
                        return;
                    } else {
                        cons.swig(filename, {'user_data': request.session.get('users')}, function (err, file) {
                            if (err) {
                                response.writeHead(500, {
                                    'Content-Type': 'text/plain'
                                });
                                response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                                response.end();
                                return;
                            }

                            var file_html = file;
                            fs.readFile(header_file, 'binary', function (err, html) {
                                html += file_html;
                                response.writeHead(200, {
                                    'Content-Type': 'text/html'
                                });
                                response.write(html, 'binary');
                                response.end();
                                return;
                            });
                        });
                    }
                    return;
                });
                return;
            }

            if (request.url.indexOf("/users/recordings") > -1) {

                var filename = filename.replace(resolveURL('/users/recordings'), '');
                var header_file = resolveURL(filename + '/demos/users/header.html');
                filename += resolveURL('/demos/users/recordings.html');

                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        response.writeHead(302, {
                            'Location': '/users/login'
                        });
                        response.end();
                        return;
                    } else {
                        users.getRecordings(request, response, function (recording_data) {

                            cons.swig(filename, {'user_data': request.session.get('users'), 'recording_data': recording_data}, function (err, file) {
                                if (err) {
                                    response.writeHead(500, {
                                        'Content-Type': 'text/plain'
                                    });
                                    response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                                    response.end();
                                    return;
                                }

                                var file_html = file;
                                fs.readFile(header_file, 'binary', function (err, html) {
                                    html += file_html;
                                    response.writeHead(200, {
                                        'Content-Type': 'text/html'
                                    });
                                    response.write(html, 'binary');
                                    response.end();
                                    return;
                                });
                            });
                        });
                    }
                    return;

                });
                return;
            }


            if (request.url.indexOf("/users/classes/delete") > -1) {

                session.startSession(request, response, function () {
                    response.writeHead(200, {
                        'Content-Type': "application/json; charset=utf-8"
                    });

                    if (request.session.get('users') == undefined) {
                        data = JSON.stringify({'status': 0});
                        response.write(data, 'binary');
                        response.end();
                    } else {
                        if (request.method == 'POST') {
                            users.deleteClasses(request, function (data) {
                                classesdata = JSON.stringify(data);
                                response.write(classesdata, 'binary');
                                response.end();
                            });
                            return;
                        }
                    }
                    return;
                });
                return;
            }

            if (request.url == '/users/classes/time_extend') {

                if (request.method == 'POST') {
                    response.writeHead(200, {
                        'Content-Type': "application/json; charset=utf-8"
                    });

                    users.classTimeExtend(request, response, function (data) {
                        classesdata = JSON.stringify(data);
                        response.write(classesdata, 'binary');
                        response.end();
                    });
                    return;
                }
            }

            if (request.url == '/users/uploads/delete') {
                session.startSession(request, response, function () {
                    response.writeHead(200, {
                        'Content-Type': "application/json; charset=utf-8"
                    });
                    if (request.session.get('users') == undefined) {
                        data = JSON.stringify({'status': 0});
                        response.write(data, 'binary');
                        response.end();

                    } else {
                        if (request.method == 'POST') {
                            users.deleteFiles(request, function (data) {

                                filedata = JSON.stringify(data);
                                response.write(filedata, 'binary');
                                response.end();
                            });
                            return;
                        }
                    }
                    return;
                });
                return;
            }

            if (request.url.indexOf("classes/list") > -1) {

                session.startSession(request, response, function () {
                    var role = request.session.get('users').role;
                    if (role == 1) {
                        users.getClassListByPresenter(request, response, function (class_data) {
                            classesdata = JSON.stringify(class_data);
                            response.write(classesdata, 'binary');
                            response.end();
                            return;
                        });
                    } else {
                        users.getClassListByLearner(request, response, function (class_data) {
                            classesdata = JSON.stringify(class_data);
                            response.write(classesdata, 'binary');
                            response.end();
                            return;
                        });
                    }
                });


                return;
            }

            if (request.url.indexOf("classes/save_session") > -1) {
                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        data = JSON.stringify({'status': 0});
                        response.write(data, 'binary');
                        response.end();
                    } else {
                        users.saveClassSessions(request, response, function (class_data) {
                            classesdata = JSON.stringify(class_data);
                            response.write(classesdata, 'binary');
                            response.end();
                            return;
                        });
                    }
                    return
                });
                return;
            }

            if (request.url.indexOf("classes/update_session_log") > -1) {
                session.startSession(request, response, function () {
                    console.log(request.session.get('users'));
                    if (request.session.get('users') == undefined) {
                        response.writeHead(200, {
                            'Content-Type': "application/json; charset=utf-8"
                        });
                        data = JSON.stringify({'status': 0});
                        response.write(data, 'binary');
                        response.end();
                    } else {
                        users.updateClassSessionLog(request, response, function (class_data) {
                            classesdata = JSON.stringify(class_data);
                            response.write(classesdata, 'binary');
                            response.end();
                            return;
                        });
                    }
                    return;
                });

                return;
            }



            if (request.url == '/users/classes') {

                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined && request.method != 'POST') {
                        response.writeHead(302, {
                            'Location': '/users/login'
                        });
                        response.end();
                        return;
                    } else if (request.session.get('users') == undefined && request.method == 'POST') {
                        response.writeHead(200, {
                            'Content-Type': "application/json; charset=utf-8"
                        });
                        data = JSON.stringify({'status': 0});
                        response.write(data, 'binary');
                        response.end();
                        return;
                    } else {
                        if (request.method == 'POST') {
                            response.writeHead(200, {
                                'Content-Type': "application/json; charset=utf-8"
                            });

                            users.addClasses(request, response, function (data) {
                                classesdata = JSON.stringify(data);
                                response.write(classesdata, 'binary');
                                response.end();
                            });
                            return;
                        } else {

                            filename = filename.replace(resolveURL('/users/classes'), '');
                            header_file = resolveURL(filename + '/demos/users/header.html');
                            filename += resolveURL('/demos/users/classes.html');

                            session.startSession(request, response, function () {
                                var role = request.session.get('users').role;
                                cons.swig(filename, {user_role: role}, function (err, file) {
                                    //fs.readFile(filename, 'binary', function (err, file) {
                                    var file_html = file;
                                    fs.readFile(header_file, 'binary', function (err, html) {
                                        html += file_html;
                                        response.writeHead(200, {
                                            'Content-Type': 'text/html'
                                        });
                                        response.write(html, 'binary');
                                        response.end();
                                        return;
                                    });
                                    // });
                                });
                            });
                            return;
                        }
                    }
                });

                return;
            }

            if (request.url.indexOf("uploads/list") > -1) {
                session.startSession(request, response, function () {
                    var role = request.session.get('users').role;

                    users.getUploadsList(request, response, function (files_data) {
                        files_data = JSON.stringify(files_data);
                        response.write(files_data, 'binary');
                        response.end();
                        return;
                    });

                });
                return;
            }

            if (request.url.indexOf("uploads/sendInvite") > -1) {
                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        response.writeHead(200, {
                            'Content-Type': "application/json; charset=utf-8"
                        });

                        data = JSON.stringify({'status': 0});
                        response.write(data, 'binary');
                        response.end();
                        return;
                    } else {
                        var role = request.session.get('users').role;
                        users.getDataForShare(request, response, function (files_data) {
                            files_data = JSON.stringify(files_data);
                            response.write(files_data, 'binary');
                            response.end();
                            return;
                        });
                    }
                    return;
                });

                return;
            }

            if (request.url.indexOf("uploads/shareFile") > -1) {
                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        response.writeHead(200, {
                            'Content-Type': "application/json; charset=utf-8"
                        });
                        profile_data = JSON.stringify({'status': 0});
                        response.write(profile_data, 'binary');
                        response.end();
                        return;
                    } else {
                        var role = request.session.get('users').role;
                        users.shareFile(request, response, function (share_data) {
                            share_data = JSON.stringify(share_data);
                            response.write(share_data, 'binary');
                            response.end();
                            return;
                        });
                    }
                    return
                });
                return;
            }

            if (request.url == '/users/uploads') {
                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined && request.method != 'POST') {
                        response.writeHead(302, {
                            'Location': '/users/login'
                        });
                        response.end();
                        return;
                    } else if (request.session.get('users') == undefined && request.method == 'POST') {
                        data = JSON.stringify({'status': 0});
                        response.writeHead(200, {
                            'Content-Type': "application/json; charset=utf-8"
                        });
                        response.write(data, 'binary');
                        response.end();
                        return;
                    } else {
                        if (request.method == 'POST') {
                            response.writeHead(200, {
                                'Content-Type': "application/json; charset=utf-8"
                            });

                            users.uploadFiles(request, response, function (data) {
                                file_Data = JSON.stringify(data);
                                response.write(file_Data, 'binary');
                                response.end();
                            });
                            return;
                        } else {

                            filename = filename.replace(resolveURL('/users/uploads'), '');
                            header_file = resolveURL(filename + '/demos/users/header.html');
                            filename += resolveURL('/demos/users/uploads.html');

                            session.startSession(request, response, function () {
                                var role = request.session.get('users').role;
                                cons.swig(filename, {user_role: role}, function (err, file) {
                                    //fs.readFile(filename, 'binary', function (err, file) {
                                    var file_html = file;
                                    fs.readFile(header_file, 'binary', function (err, html) {
                                        html += file_html;

                                        response.writeHead(200, {
                                            'Content-Type': 'text/html'
                                        });

                                        response.write(html, 'binary');
                                        response.end();
                                        return;
                                    });
                                    // });
                                });
                            });
                            return;
                        }
                    }
                    return;
                });
                return;
            }

            if (request.url.indexOf("users/shared_list") > -1) {

                session.startSession(request, response, function () {
                    var role = request.session.get('users').role;

                    users.getSharedHistory(request, response, function (files_data) {
                        files_data = JSON.stringify(files_data);
                        response.write(files_data, 'binary');
                        response.end();
                        return;
                    });

                });
                return;
            }

            if (request.url == '/users/shareHistory') {

                filename = filename.replace(resolveURL('/users/shareHistory'), '');
                header_file = resolveURL(filename + '/demos/users/header.html');
                filename += resolveURL('/demos/users/share_history.html');

                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        response.writeHead(302, {
                            'Location': '/users/login'
                        });
                        response.end();
                        return;
                    } else {
                        var role = request.session.get('users').role;
                        cons.swig(filename, {user_role: role}, function (err, file) {
                            var file_html = file;
                            fs.readFile(header_file, 'binary', function (err, html) {
                                html += file_html;
                                response.writeHead(200, {
                                    'Content-Type': 'text/html'
                                });

                                response.write(html, 'binary');
                                response.end();
                                return;
                            });
                        });
                    }
                    return;
                });

                return;

            }

            if (request.url.indexOf("invite/list") > -1) {
                users.getLearnersList(request, response, function (class_data) {
                    classesdata = JSON.stringify(class_data);
                    response.write(classesdata, 'binary');
                    response.end();
                    return;
                });
                return;
            }

            if (request.url.indexOf("users/attendees/list") > -1) {
                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        classesdata = JSON.stringify({'status': 0});
                        response.write(classesdata, 'binary');
                        response.end();
                    } else {
                        users.getAttendeesData(request, response, function (class_data) {
                            classesdata = JSON.stringify(class_data);
                            response.write(classesdata, 'binary');
                            response.end();
                            return;
                        });
                    }
                    return;
                });

                return;
            }

            if (request.url.indexOf("classes/view") > -1) {
                qstring = request.url.split('view?id=');
                var class_id = qstring[1];
                var filename = filename.replace(resolveURL('/users/classes/view'), '');
                var header_file = resolveURL(filename + '/demos/users/header.html');
                filename += resolveURL('/demos/users/classes/view.html');

                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        response.writeHead(302, {
                            'Location': '/users/login'
                        });
                        response.end();
                        return;
                    } else {
                        users.getClassById(class_id, function (class_data) {
                            session.startSession(request, response, function () {
                                if (request.session.get('users') == undefined) {
                                    cookies.set('last_url', request.url);
                                    response.writeHead(301, {
                                        'Location': '/users/login'
                                    });

                                    response.end();
                                    return;
                                }

                                cookies.set('last_url', false);

                                cons.swig(filename, {class_data: class_data, 'user_data': request.session.get('users')}, function (err, file) {
                                    if (err) {
                                        response.writeHead(500, {
                                            'Content-Type': 'text/plain'
                                        });
                                        response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                                        response.end();
                                        return;
                                    }

                                    var file_html = file;
                                    fs.readFile(header_file, 'binary', function (err, html) {
                                        html += file_html;
                                        response.writeHead(200, {
                                            'Content-Type': 'text/html'
                                        });
                                        response.write(html, 'binary');
                                        response.end();
                                        return;
                                    });
                                });
                            });

                        });
                        return;
                    }
                });

                return;
            }

            if (request.url == '/users/recording_share') {
                if (request.method == 'POST') {
                    users.shareRecordings(request, response, function (data) {
                        recorddata = JSON.stringify(data);
                        response.write(recorddata, 'binary');
                        response.end();
                    });
                    return;
                }
            }

            if (request.url == '/users/invite') {

                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        data = JSON.stringify({'status': 0});
                        response.write(data, 'binary');
                        response.end();
                        return;
                    } else {
                        if (request.method == 'POST') {
                            response.writeHead(200, {
                                'Content-Type': "application/json; charset=utf-8"
                            });

                            users.sendInvites(request, response, function (data) {
                                classesdata = JSON.stringify(data);
                                response.write(classesdata, 'binary');
                                response.end();
                            });
                            return;
                        } else {

                            filename = filename.replace(resolveURL('/users/invite'), '');
                            header_file = resolveURL(filename + '/demos/users/header.html');
                            filename += resolveURL('/demos/users/invite.html');

                            fs.readFile(filename, 'binary', function (err, file) {
                                var file_html = file;
                                fs.readFile(header_file, 'binary', function (err, html) {
                                    html += file_html;
                                    response.writeHead(200, {
                                        'Content-Type': 'text/html'
                                    });
                                    response.write(html, 'binary');
                                    response.end();
                                    return;
                                });
                            });

                            return;
                        }
                        return;
                    }
                });
                return;
            }

            if (request.url.indexOf("profile/setting") > -1) {
                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        response.writeHead(302, {
                            'Location': '/users/login'
                        });
                        response.end();
                        return;
                    } else {
                        filename = filename.replace(resolveURL('/users/profile/setting'), '');
                        header_file = resolveURL(filename + '/demos/users/header.html');
                        filename += resolveURL('/demos/users/profile_edit.html');

                        session.startSession(request, response, function () {
                            var role = request.session.get('users').role;
                            users.getUserData(request, response, function (userdata) {
                                cons.swig(filename, {user: userdata.data}, function (err, file) {
                                    var file_html = file;
                                    fs.readFile(header_file, 'binary', function (err, html) {
                                        html += file_html;
                                        response.writeHead(200, {
                                            'Content-Type': 'text/html'
                                        });
                                        response.write(html, 'binary');
                                        response.end();
                                        return;
                                    });

                                });
                            });
                        });
                    }
                });


                return;
            }

            if (request.url == '/users/profile') {
                cookies.set('mytest', 'this is test cookie');
                if (cookies.get('last_url') != undefined) {
                    response.writeHead(301, {
                        'Location': cookies.get('last_url')
                    });
                    response.end();
                    return;
                }

                session.startSession(request, response, function () {
                    if (request.session.get('users') == undefined) {
                        response.writeHead(302, {
                            'Location': '/users/login'
                        });
                        response.end();
                        return;
                    } else {
                        filename = filename.replace(resolveURL('/users/profile'), '');
                        header_file = resolveURL(filename + '/demos/users/header.html');
                        filename += resolveURL('/demos/users/profile.html');
                        var role = request.session.get('users').role;
                        users.getUserData(request, response, function (userdata) {
                            users.getDashboardData(request, response, function (dashbord) {
                                cons.swig(filename, {user: userdata.data, dashbord_data: dashbord}, function (err, file) {
                                    var file_html = file;
                                    fs.readFile(header_file, 'binary', function (err, html) {
                                        html += file_html;
                                        response.writeHead(200, {
                                            'Content-Type': 'text/html'
                                        });
                                        response.write(html, 'binary');
                                        response.end();
                                        return;
                                    });
                                });
                            });

                        });

                    }
                    return;
                });



                return;
            }


        } catch (e) {
            pushLogs(root, 'url.parse', e);
        }

        filename = (filename || '').toString();

        if (request.method !== 'GET' || uri.indexOf('..') !== -1) {
            try {
                response.writeHead(401, {
                    'Content-Type': 'text/plain'
                });
                response.write('401 Unauthorized: ' + path.join('/', uri) + '\n');
                response.end();
                return;
            } catch (e) {
                pushLogs(root, '!GET or ..', e);
            }
        }

        if (filename.indexOf(resolveURL('/admin/')) !== -1 && config.enableAdmin !== true) {
            try {
                response.writeHead(401, {
                    'Content-Type': 'text/plain'
                });
                response.write('401 Unauthorized: ' + path.join('/', uri) + '\n');
                response.end();
                return;
            } catch (e) {
                pushLogs(root, '!GET or ..', e);
            }
            return;
        }

        var matched = false;
        ['/demos/', '/uploads/', '/dev/', '/dist/', '/routes/', 'connection', '/socket.io/', '/node_modules/canvas-designer/', '/admin/'].forEach(function (item) {
            if (filename.indexOf(resolveURL(item)) !== -1) {
                matched = true;
            }
        });

        // files from node_modules
        ['RecordRTC.js', 'FileBufferReader.js', 'getStats.js', 'getScreenId.js', 'adapter.js', 'MultiStreamsMixer.js'].forEach(function (item) {
            if (filename.indexOf(resolveURL('/node_modules/')) !== -1 && filename.indexOf(resolveURL(item)) !== -1) {
                matched = true;
            }
        });


        if (filename.search(/.js|.json/g) !== -1 && !matched) {
            try {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                response.end();
                return;
            } catch (e) {
                pushLogs(root, '404 Not Found', e);
            }
        }

        ['Video-Broadcasting', 'Screen-Sharing', 'Switch-Cameras'].forEach(function (fname) {
            try {
                if (filename.indexOf(fname + '.html') !== -1) {
                    filename = filename.replace(fname + '.html', fname.toLowerCase() + '.html');
                }
            } catch (e) {
                pushLogs(root, 'forEach', e);
            }
        });

        var stats;

        try {
            stats = fs.lstatSync(filename);

            if (filename.search(/users/g) === -1 && filename.search(/admin/g) === -1 && stats.isDirectory() && config.homePage === '/users/login.html') {

                if (response.redirect) {

                    response.redirect('/demos/');
                } else {

                    response.writeHead(301, {
                        'Location': '/users/login'
                    });
                }
                response.end();
                return;
            }
        } catch (e) {

            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
            response.end();
            return;
        }

        try {


            if (fs.statSync(filename).isDirectory()) {
                response.writeHead(404, {
                    'Content-Type': 'text/html'
                });


                if (filename.indexOf(resolveURL('/demos/MultiRTC/')) !== -1) {
                    filename = filename.replace(resolveURL('/demos/MultiRTC/'), '');
                    filename += resolveURL('/demos/MultiRTC/index.html');
                } else if (filename.indexOf(resolveURL('/admin/')) !== -1) {
                    filename = filename.replace(resolveURL('/admin/'), '');
                    filename += resolveURL('/admin/index.html');
                } else if (filename.indexOf(resolveURL('/demos/dashboard/')) !== -1) {
                    filename = filename.replace(resolveURL('/demos/dashboard/'), '');
                    filename += resolveURL('/demos/dashboard/index.html');
                } else if (filename.indexOf(resolveURL('/demos/video-conference/')) !== -1) {
                    filename = filename.replace(resolveURL('/demos/video-conference/'), '');
                    filename += resolveURL('/demos/video-conference/index.html');
                } else if (filename.indexOf(resolveURL('/demos')) !== -1) {
                    filename = filename.replace(resolveURL('/demos/'), '');
                    filename = filename.replace(resolveURL('/demos'), '');
                    filename += resolveURL('/demos/index.html');
                } else {

                    filename += resolveURL(config.homePage);
                }

            }
        } catch (e) {
            pushLogs(root, 'statSync.isDirectory', e);
        }

        var contentType = 'text/plain';
        if (filename.toLowerCase().indexOf('.html') !== -1) {
            contentType = 'text/html';
        }
        if (filename.toLowerCase().indexOf('.css') !== -1) {
            contentType = 'text/css';
        }
        if (filename.toLowerCase().indexOf('.png') !== -1) {
            contentType = 'image/png';
        }
        if (filename.indexOf(resolveURL('/demos/dashboard/')) !== -1) {
            //filename = filename.replace(resolveURL('/demos/dashboard/'), '');

        }
        fs.readFile(filename, 'binary', function (err, file) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                response.end();
                return;
            }

            try {
                file = file.replace('connection.socketURL = \'/\';', 'connection.socketURL = \'' + config.socketURL + '\';');
            } catch (e) {
            }

            response.writeHead(200, {
                'Content-Type': contentType
            });
            response.write(file, 'binary');
            response.end();
        });
    } catch (e) {
        pushLogs(root, 'Unexpected', e);

        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write('404 Not Found: Unexpected error.\n' + e.message + '\n\n' + e.stack);
        response.end();
    }
});
