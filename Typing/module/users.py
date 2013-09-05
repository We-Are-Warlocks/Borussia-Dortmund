# -*- coding: utf-8 -*-
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import json


class UsersManager(object):
    users = {}
    pads = {}

    def __init__(self):
        pass

    def getUserList(self, pad):
        if(not pad in self.pads):
            self.pads[pad] = {}
        userlist = self.pads[pad].keys()
        return userlist

    def updateUsersStatus(self, pad, username, ws):        
        userlist = self.getUserList(pad)
        r = {}
        r['type'] = 'server-message'
        r['subtype'] = 'user-status-update'
        r['content'] = userlist
        listString = json.dumps(r)
        print userlist
        self.broadCastPadMessage(pad, username, listString)
        return listString


    def broadCastPadMessage(self, pad, username, message):
        if(not pad in self.pads):
            print 'Error occur, pad %s not exist!' % pad
        else:
            for u in self.pads[pad].keys():
                if(not u == username):
                    self.pads[pad][u]['ws'].write_message(message)

    def userArrived(self, username, pad, ws):
        if(not pad in self.pads):
            self.pads[pad] = {}
        r = {}
        r['type'] = 'server-message'
        r['content'] = 'Welcome here, hero ' + username
        ws.write_message(json.dumps(r))
        userobj = {}
        userobj['name'] = username
        userobj['pad'] = pad
        userobj['ws'] = ws
        self.pads[pad][username] = userobj        
        ws.write_message(self.updateUsersStatus(pad, username, ws))
        for u in self.pads[pad].keys():
            if(not u == username):
                r = {}
                r['type'] = 'server-message'
                r['subtype'] = 'user-arrive'
                r['content'] = username
                self.pads[pad][u]['ws'].write_message(json.dumps(r))

    def userLeave(self, username, pad):
        if(not pad in self.pads):
            print 'Error occur, pad %s not exist!' % pad
        elif (not username in self.pads[pad]):
            print 'Error occur, user %s in pad %s not exist!' % (username, pad)
        else:
            del self.pads[pad][username]
            for u in self.pads[pad].keys():
                r = {}
                r['type'] = 'server-message'
                r['subtype'] = 'user-leave'
                r['content'] = username + ' leave the pad!'
                self.updateUsersStatus(pad, username, None)
                self.pads[pad][u]['ws'].write_message(json.dumps(r))


class UserReqHandler(tornado.web.RequestHandler):
    def post(self):
        username = self.get_argument('user')
        padname = self.get_argument('pad')
        self.render('pad_status.html', users=[], n=username, p=padname)

userManager = UsersManager()
