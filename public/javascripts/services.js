    app.service('Users', ['$resource', function ($resource) {
        this.signin = function (formData) {
            return $resource('/users/login', {
                save: { method: 'POST' }
            })
        }
    this.signup = function (formData) {
        console.log(formData);
        return $resource('/users/register', {
            save: { method: 'POST' }

        });
    }
    this.ForgotPass = function (formData) {
        console.log(formData);
        return $resource('/users/forgotpass', {
            save: { method: 'POST' }

        });
    }
    this.SubmitForgotPass = function (userId) {
        //console.log(formData);
        return $resource('/users/submitforgotpass/' + userId, {
            save: { method: 'POST' }

        });
    }
    this.submitUserData = function (userId) {
        //console.log(formData);
        return $resource('/users/submitUserData/', {
            save: { method: 'POST' }

        });
    }
    this.logout = function () {
        return $resource('/users/userLogout')
    }
    this.userActivate = function (userId) {
        return $resource('/users/useractivate/' + userId)
    }
    this.getUserData = function (userId) {
        return $resource('/users/getuserdata/'+userId)
    }
    this.getFriendData = function (friendid) {
        return $resource('/users/getFriendData/' + friendid)
    }
    this.changePassword = function () {
        //console.log(formData);
        return $resource('/users/changePassword', {
            save: { method: 'POST' }

        });
    }
    this.userList = function () {
        return $resource('/users/userList')
    }
}]);

app.factory('Post', function ($resource) {
    return {
        messageSave: function () {
            console.log('Message send');
            return $resource('/post/messagesave', {
                save: { method: 'POST' }
            });
        },
        commentSave: function (messageId) {
            return $resource('/comment/commentsave/', {
                save: { method: 'POST' }
            });
        },
        getMessages: function (userId) {
            return $resource('/post/getallmessage/' + userId);
        },
        getMoreData: function () {           
            return $resource('/post/getMoreData/', {
                save: { method: 'POST' }
            });
            //return $resource('/post/getMoreData/' + msgLastId);
        },
        getMessagesImages: function () {
            return $resource('/post/getMessagesImages');
        },
        deletePost: function (postId) {
            return $resource('/post/deletePost/' + postId);
        },
        deleteComment: function (commentId) {
            console.log('Delete comment factory');
            return $resource('/comment/deleteComment/' + commentId);
        },
    };
});


app.factory('Msg', function ($resource) {
    return {
        sendMsg: function (form) {
            return $resource('/message/savemessage', {
                save: { method: 'POST' }
            })
        },
        getInboxMsgs: function () {
            return $resource('/message/getInboxMsgs')
        },
        getSentMsgs: function () {
            return $resource('/message/getSentItems')
        }
    }
});

app.factory('Friends', function ($resource) {
    return {
        serachFriend: function (keyword) {
            return $resource('/friends/serachFriend/' + keyword)
        },
        addFriend: function (friendID) {
            return $resource('/friends/addFriend/' + friendID)
        },
        acceptRequest: function (friendID) {
            return $resource('/friends/acceptRequest/' + friendID)
        },
        rejectRequest: function (friendID) {
            return $resource('/friends/rejectRequest/' + friendID)
        },
        removeFriend: function (friendID) {
            return $resource('/friends/removeFriend/' + friendID)
        },
        getFriend: function () {
            return $resource('/friends/getFriend')
        },
        userFriendsArray: function () {
            return $resource('/friends/userFriendsArray')
        }
    }
});