/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function ($scope, $rootScope, $location, $http, toastr) {
    $rootScope.location = $location.path();
});

app.controller("UserCtrl", function ($scope, $localStorage, $rootScope, $http, $location, $routeParams, Users, toastr) {
    $scope.loginUser = function (formData) {
        // use $.param jQuery function to serialize data from JSON 
        Users.signin().save($scope.formData, function (results) {
            if (results.status == 200) {
                console.log(results.data);
                var message = results.message;
                toastr.success(message);
                $localStorage.token = results.token;
                $localStorage.userId = results.data._id;
                $localStorage.username = results.data.username;
                $localStorage.userDetails = results.data;
                $rootScope.localStorage = $localStorage;
                $rootScope.username = results.data.username;
                $location.path('/dashboard');
            } else {
                $scope.ResponseDetails = results.message;
                toastr.warning(results.message);
            }
        });
    };

    $scope.registerUser = function (formData) {
        //console.log('post data');
        Users.signup().save($scope.formData, function (returndata) {
            if (returndata.status == 200) {
                //$scope.PostDataResponse = returndata.message;
                $scope.ResponseRegDetails = '';
                var message = returndata.message;
                toastr.success(message);
            } else if (returndata.status == 201) {
                $scope.ResponseRegDetails = '';
                var message = returndata.message;
                toastr.warning(message);
            } else {
                $scope.ResponseRegDetails = returndata.message;
                toastr.warning(returndata.message);
            }
        });
    };

    $scope.getUserData = function () {
        var userDetails = $localStorage.userDetails;

        Users.getUserData(userDetails._id).get(function (results) {
            if (results.status == 200) {
                console.log(results);
                $rootScope.username = results.userdata.username;
                $rootScope.name = results.userdata.first_name + ' ' + results.userdata.last_name;
                $rootScope.email = results.userdata.email;
                $rootScope.image = results.userdata.image;
                $rootScope.joined = results.userdata.joined;
                $rootScope.location = results.userdata.location;
            } else {
                var message = returndata.message;
                var toastInstance = toastr.pop({ type: 'warning', body: message});
            }
        });
    }

    $scope.submitUserData = function (userData) {
        console.log($scope.userData.location);
        console.log($scope.userData);
        var geocoder = new google.maps.Geocoder();
        var address = userData.location;
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
            }
            userData.lat = latitude;
            userData.lng = longitude;
            var userDetails = $localStorage.userDetails;
            console.log('userid' + userDetails._id);
            userData.userId = userDetails._id;
            console.log($scope.userData);
            Users.submitUserData().save($scope.userData, function (result) {
                if (result.status == 200) {
                    //$scope.PostDataResponse = returndata.message;
                    $scope.ResponseDetails = '';
                    var message = result.message;
                    $localStorage.username = results.user.username;
                    $localStorage.userDetails = results.user;
                    $localStorage.userDetails = results.user;
                    $localStorage.userDetails = results.user;
                    $localStorage.userDetails = results.user;
                    $localStorage.userDetails = results.user;
                    $scope.localStorage = $localStorage;
                    toastr.success(message);
                } else {
                    toastr.warning(returndata.message);
                }
            });
        });
    };

    $scope.ForgotPassword = function (formData) {
        console.log('post data');
        Users.ForgotPass().save($scope.formData, function (returndata) {
            if (returndata.status == 200) {
                // $scope.PostDataResponse = returndata.message;
                $scope.ResponseDetails = '';
                var message = returndata.message;
                toastr.success(message);
            } else {
                toastr.warning(returndata.message);
            }
        });
    };

    $scope.SubmitForgotPass = function (formData) {
        var userId = $routeParams.id;
        //console.log('forgot data- ' + userId);
        Users.SubmitForgotPass(userId).save($scope.formData, function (returndata) {
            if (returndata.status == 200) {
                //$scope.PostDataResponse = returndata.message;
                $scope.ResponseDetails = '';
                var message = returndata.message;
                toastr.success(message);
            } else {
                toastr.warning(returndata.message);
            }
        }
        );
    };



    $scope.useractivate = function () {
        // use $.param jQuery function to serialize data from JSON 
        var userId = $routeParams.id;
        //console.log('User Id- ' + userId);
        Users.userActivate(userId).get(function (returndata) {
            if (returndata.status == 200) {
                //$scope.PostDataResponse = returndata.message;
                $scope.ResponseDetails = '';
                var message = returndata.message;
                toastr.success(message);
            } else {
                toastr.warning(returndata.message);
            }
        });
    };


    $scope.getFriendData = function () {
        //console.log('Get user data');
        var friendid = $routeParams.friendid;
        if (friendid) {
            Users.getFriendData(friendid).get(function (returndata) {
                if (returndata.status == 200) {
                    $scope.ResponseDetails = '';
                    $scope.userData = returndata.message;
                    //console.log(returndata.message);
                } else {
                    toastr.warning(returndata.message);
                }
            });
        }

        // use $.param jQuery function to serialize data from JSON 

    };

    $scope.changePassword = function (formData) {
        //console.log('Chaneg Password');
        Users.changePassword().save($scope.formData, function (returndata) {
            if (returndata.status == 200) {
                //$scope.PostDataResponse = returndata.message;
                $scope.ResponseDetails = '';
                var message = returndata.message;
                toastr.success(message);
            } else {
                toastr.warning(returndata.message);
            }
        });
    };

});



app.controller("LogoutCtrl", function ($scope, $localStorage, $rootScope, $http, $location, $routeParams, Users, toastr) {
    $scope.logout = function () {
        // use $.param jQuery function to serialize data from JSON 
        //console.log('Logout function');
        $rootScope.isLoggedIn = false;
        $localStorage.$reset();
        var message = 'You have logout successfully.';
        toastr.success(message);
        $location.path('/');
        //window.location.reload();
    };
});

app.controller("GalleryCtrl", function (Post, $scope, $rootScope, $http, $location, $routeParams, toastr) {

    $scope.getMessagesImages = function () {
        return Post.getMessagesImages().get(function (results) {
            if (results.status == 200) {
                $scope.messages = results.message;

            } else {
                //console.log(results); 
                if (typeof results.error != 'undefined') {
                    $scope.serverErros = results.error
                } else {
                    $scope.PostDataResponse = results.message;
                }
            }
        });
    };

});


app.controller('UploadCtrl', function ($scope, $localStorage, $rootScope, $location, toastr) {
    var $scope = this;
    $scope.uploadfile = function () { //function to call on form submit
        if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
            $scope.upload($scope.file); //call upload function
        }
    }

    $scope.upload = function (file) {
        $http.post({
            url: '/upload', //webAPI exposed to upload the file
            data: { file: file } //pass file as data, should be user ng-model
        }).then(function (resp) {
            //console.log(resp);
            if (resp.data.status == 200) {
                var message = 'Profile has been changed ';
                toastr.success(message);
                $rootScope.profilefilenamePath = 'images/uploads/' + resp.data.imagename;
            }
            //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                console.log('Success: ' + resp.config.data.file.name + 'uploaded. Response:');
            } else {
                console.log('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress         
            //$rootScope.profilefilenamePath = 'images/uploads/' + resp.data.imagename;
        });
    };
});


app.controller('PostCtrl', function (Post, $scope, $localStorage, $rootScope, $location, $route, toastr) {

    $scope.sendMessage = function () {
        if (typeof $scope.message != 'undefined') {
            //var msgData =($scope.message, $scope.filenamePath);
            var userDetails = $localStorage.userDetails;
            console.log('userid' + userDetails._id);
            var msgData = { "message": $scope.message, "userId": userDetails._id, "image": $scope.filenamePath };
            console.log(msgData);
            return Post.messageSave().save(msgData, function (results) {
                //console.log(results);
                if (results.status === 200) {
                    //console.log('test');
                    $scope.PostDataResponse = '';
                    var message = 'Message has been saved successfully..';
                    toastr.success(message);
                    $rootScope.filenamePath = '';
                    $rootScope.uploadImageMsg = '';
                    $scope.message = '';
                    $scope.getMessages();
                } else {
                    //console.log(results); 
                    if (typeof results.error != 'undefined') {
                        $scope.serverErros = results.error
                    } else {
                        $scope.PostDataResponse = results.message;
                    }
                }
            });
        } else {
            $scope.PostDataResponse = 'Please add message first';
            var toastInstance = toastr.pop({ type: 'warning', body: 'Please add message first' });
        }
    };

    $scope.sendComment = function (commentData, messageId, commentfilenamePath) {
        //console.log(commentData); return;
        if (typeof commentData != 'undefined') {
            var userDetails = $localStorage.userDetails;
            console.log('userid' + userDetails._id);
            var commentRecord = { "comment": commentData.comment, "messageId": messageId, "userId": userDetails._id, "image": $scope.commentfilenamePath };
            //console.log(commentRecord);
            //console.log(messageId);
            return Post.commentSave().save(commentRecord, function (results) {
                //console.log(results);
                if (results.status === 200) {
                    //console.log('test');
                    var message = 'Comment has been saved successfully.';
                    toastr.success(message);
                    $scope.PostDataResponse = '';
                    $rootScope.commentfilenamePath = '';
                    $scope.commentData = '';
                    $scope.getMessages();
                } else {
                    //console.log(results); 
                    if (typeof results.error != 'undefined') {
                        $scope.serverErros = results.error
                    } else {
                        $scope.PostDataResponse = results.message;
                    }
                }
            });
        } else {
            var message = 'Please add comment first.';
            toastr.warning(message);
            $scope.PostDataResponse = 'Please add comment first';
            
        }
    };

    $scope.getMessages = function () {
        var userDetails = $localStorage.userDetails;
        console.log('userid' + userDetails._id);
        return Post.getMessages(userDetails._id).get(function (results) {
            //console.log(results.messages[0].user[0].first_name);
            if (results.status === 1) {
                $scope.messages = results.messages;
                if (results.messages.length > 0) {
                    $rootScope.lod = true;
                    $rootScope.lastItem = results.messages.slice(-1).pop();
                } else {
                    $rootScope.lastItem = '';
                    $rootScope.lod = false;
                }
            } else {
                //console.log(results); 
                if (typeof results.error != 'undefined') {
                    $scope.serverErros = results.error
                } else {
                    $rootScope.filenamePath = '';
                    $rootScope.uploadImageMsg = '';
                    $scope.PostDataResponse = results.message;
                    toastr.warning(returndata.message);
                }
            }
        });
    };

    $scope.getMoreData = function (msgLastId) {
        var userDetails = $localStorage.userDetails;
        console.log('userid' + userDetails._id);
        var postData = {
            msgLastId: msgLastId,
            userId: userDetails._id
        }
        console.log(postData);
        Post.getMoreData().save(postData, function (results) {
            //console.log(results.messages[0].user[0].first_name);
            if (results.status === 200) {
                $scope.messages.push.apply(postData, results.messages);
                if (results.messages.length > 0) {
                    $rootScope.lastItem = results.messages.slice(-1).pop();
                    $rootScope.lod = true;
                } else {
                    $rootScope.lastItem = '';
                    $rootScope.lod = false;
                }
            } else {
                //console.log(results); 
                if (typeof results.error != 'undefined') {
                    $scope.serverErros = results.error
                } else {
                    $rootScope.filenamePath = '';
                    $rootScope.uploadImageMsg = '';
                    $scope.PostDataResponse = results.message;
                    toastr.warning(returndata.message);
                }
            }
        });
    };

    $scope.deletePost = function (id, confirmation) {
        //console.log(id);
        confirmation = (typeof confirmation !== 'undefined') ? confirmation : true;
        if (confirmDelete(confirmation)) {
            Post.deletePost(id).get(function (returndata) {
                if (returndata.status == 200) {
                    //$scope.PostDataResponse = returndata.message;
                    $scope.ResponseDetails = '';
                    var message = returndata.message;
                    toastr.success(message);
                    $scope.getMessages();
                } else {
                    $scope.ResponseDetails = returndata.message;
                    toastr.warning(returndata.message);
                }
            });
        }
    };

    $scope.deleteComment = function (id, confirmation) {
        //console.log(id);
        confirmation = (typeof confirmation !== 'undefined') ? confirmation : true;
        if (confirmCommentDelete(confirmation)) {
            Post.deleteComment(id).get(function (returndata) {
                if (returndata.status == 200) {
                    //$scope.PostDataResponse = returndata.message;
                    $scope.ResponseDetails = '';
                    var message = returndata.message;
                    toastr.success(message);
                    $scope.getMessages();
                } else {
                    $scope.ResponseDetails = returndata.message;
                    toastr.warning(returndata.message);
                }
            });
        }
    };
    /**
     * Method for access "window.confirm()"
     * @param  {Boolean} confirmation boolean verificator for call "confirm" method
     * @return {Boolean}
     */
    var confirmDelete = function (confirmation) {
        return confirmation ? confirm('Do you want to delete this post?') : true;
    };
    var confirmCommentDelete = function (confirmation) {
        return confirmation ? confirm('Do you want to delete this comment?') : true;
    };
});

app.controller('uploadpost', ['$scope', '$rootScope', function ($scope, $localStorage, $upload, $rootScope) {
    // upload later on form submit or something similar
    $scope.submit = function () {
        if ($scope.form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        }
    };
    var images = [];
    // upload on file select or drop
    $scope.upload = function (file) {
        $upload.upload({
            url: '/post/uploadpost',
            data: { file: file, 'username': $scope.username }
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
    // for multiple files:
    $scope.uploadFiles = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                $upload.upload({ url: '/post/uploadpost', data: { file: files[i] } }).then(function (resp) {
                    images.push(resp.data.imagename);
                    $rootScope.filenamePath = images;
                    console.log(images);
                    $rootScope.uploadImageMsg = 'Image selected';
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }
    }
}]);



app.controller('uploadcomment', ['$scope', 'Upload', '$rootScope', function ($scope, $localStorage, $upload, $rootScope) {
    // upload later on form submit or something similar
    $scope.submit = function () {
        if ($scope.form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        }
    };
    var images = [];
    // upload on file select or drop
    $scope.upload = function (file) {
        $upload.upload({
            url: '/uploadcomment',
            data: { file: file, 'username': $scope.username }
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            images.push(resp.data.imagename);
            $rootScope.commentfilenamePath = images;
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
    // for multiple files:
    $scope.uploadFiles = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                $upload.upload({ url: '/uploadcomment', data: { file: files[i] } }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    //console.log(resp.data.imagename);
                    //console.log('Image name-' + resp.data.imagename);
                    images.push(resp.data.imagename);
                    $rootScope.commentfilenamePath = images;
                    //console.log(images);
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }
    }
}]);

app.controller("MsgCtrl", function ($scope, $rootScope, $http, $location, $routeParams, Users, toastr, Msg, ngTableParams, $filter) {
    //console.log('text message controller');
    $scope.userlist = function () {
        Users.userList().get(function (results) {
            //console.log('User result- ' + results)
            if (results.status == '200') {
                $rootScope.userList = results.data;
            }
        });
    };


    $scope.saveMessage = function (form) {
        Msg.sendMsg().save(form, function (results) {
            //  console.log(results);
            if (results.status == '200') {
                $rootScope.error = '';
                var message = results.message;
                toastr.success(message);
                //                $rootScope.sucess = results.message;
                $scope.getSentItems();
            } else {
                $rootScope.sucess = '';
                $rootScope.error = results.message;
                toastr.warning(results.message);
            }
        });
    };
    $scope.getInboxItems = function () {
        Msg.getInboxMsgs().get(function (results) {
            //console.log(results);
            if (results.status == '200') {
                //console.log('Text message listing');
                //console.log(results.data);
                $scope.stores = results.data;
                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 5,
                    filter: {},
                    sorting: {
                        create_date: 'asc'
                    }
                }, {
                        total: $scope.stores.length,
                        getData: function ($defer, params) {
                            var filteredData = params.filter() ?
                                $filter('filter')($scope.stores, params.filter()) :
                                $scope.stores;
                            var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) :
                                filteredData;
                            params.total(orderedData.length);
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    });
            } else {
                $scope.warnings = results.message;
            }
        });
    };
    $scope.getSentItems = function () {
        Msg.getSentMsgs().get(function (results) {
            //console.log(results);
            if (results.status == '200') {
                //console.log('Text message listing');
                //console.log(results.data);
                $scope.stores = results.data;
                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 5,
                    filter: {},
                    sorting: {
                        create_date: 'asc'
                    }
                }, {
                        total: $scope.stores.length,
                        getData: function ($defer, params) {
                            var filteredData = params.filter() ?
                                $filter('filter')($scope.stores, params.filter()) :
                                $scope.stores;
                            var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) :
                                filteredData;
                            params.total(orderedData.length);
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    });
            } else {
                $scope.warnings = results.message;
            }
        });
    };
});

app.controller("FriendsCtrl", function ($scope, $rootScope, $http, $location, $routeParams, Friends, toastr) {
    $rootScope.friendsId = '';
    $scope.searchFriend = function (keyword) {
        //console.log('Search friend');
        if (keyword != '') {
            Friends.serachFriend(keyword).get(function (returndata) {
                if (returndata.status == 200) {
                    $rootScope.activeAddFriend = true;
                    $rootScope.userList = returndata.userList;
                    $location.path('/search');
                } else {
                    var message = returndata.message;
                    toastr.warning(message);
                }
            });
        }

    };
    $scope.addFriend = function (friendId) {
        //console.log('Add friend');
        if (friendId != '') {
            Friends.addFriend(friendId).get(function (returndata) {
                if (returndata.status == 200) {
                    $rootScope.friendsId = friendId;
                    var message = returndata.message;
                    toastr.success(message);
                } else {
                    var message = returndata.message;
                    toastr.warning(message);
                }
            });
        }

    };
    $scope.acceptRequest = function (friendId) {
        //console.log('Accept request');
        if (friendId != '') {
            Friends.acceptRequest(friendId).get(function (returndata) {
                if (returndata.status == 200) {
                    var message = returndata.message;
                    toastr.success(message);
                    $scope.getFriend();
                } else {
                    var message = returndata.message;
                    toastr.warning(message);
                }
            });
        }

    };
    $scope.rejectRequest = function (friendId) {
        //console.log('Reject request');
        if (friendId != '') {
            Friends.rejectRequest(friendId).get(function (returndata) {
                if (returndata.status == 200) {
                    $rootScope.friendsId = '';
                    var message = returndata.message;
                    toastr.success(message);
                    $scope.getFriend();
                } else {
                    var message = returndata.message;
                    toastr.warning(message);
                }
            });
        }

    };
    $scope.removeFriend = function (friendId) {
        //console.log('Remove request');
        if (friendId != '') {
            Friends.removeFriend(friendId).get(function (returndata) {
                if (returndata.status == 200) {
                    var message = returndata.message;
                    toastr.success(message);
                    $scope.getFriend();
                } else {
                    var message = returndata.message;
                    toastr.warning(message);
                }
            });
        }

    };
    $scope.getFriend = function () {
        //console.log('Get friend');
        Friends.getFriend().get(function (returndata) {
            if (returndata.status == 200) {
                $rootScope.friendList = returndata.friendList;
            } else {
                var message = returndata.message;
                toastr.warning(message);
            }
        });
    };
    $scope.userFriendsArray = function (friendId) {
        //console.log('Friends list array');
        Friends.userFriendsArray().get(function (returndata) {
            if (returndata.status == 200) {
                $rootScope.friendListArray = returndata.userFriendsArray;
            }
        });
    };


});

app.controller("MenuCtrl", function ($scope, $location) {
    $scope.menuClass = function (page) {
        var current = $location.path().substring(1);
        return page === current ? "active" : "";
    };
});



app.controller('GmapCtrl', function ($scope) {
    $scope.gPlace;
});

app.controller('imageUploadCtrl', function ($scope, $rootScope, $localStorage, $location, $http, toastr) {
    $scope.uploadFile = function () {
        var file = $scope.myFile;
        var userDetails = $localStorage.userDetails;
        console.log('userid' + userDetails._id);
        var uploadUrl = "/users/upload/" + userDetails._id;
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (results) {
            $localStorage.image = results.imagename;
            var message = results.message;
            toastr.success(message);
            $location.path('/profile');
        }).error(function () {
            var message = results.message;
            toastr.warning(message);
        });
    };
});