# -*- coding: utf-8 -*-
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import json
import competiton

def buildPackage(t, content):
    return json.dumps({
        'type':t,
        'content':content    
    })

class manager(object):    
    pads = {}    

    def __init__(self):
        self.messagemapper = {
            'prepare': self.prepareMessageHandler,
            'lag': self.lagMessageHandler,
            'competition': self.undefineMessageHandler
        }

    def usercome(self, padname, username, ws):
        if(not self.pads.has_key(padname)):
            padobj = Pad(padname)
            self.pads[padname] = padobj
        self.pads[padname].adduser(username, ws)

    def messagemap(self, padname, username, m, ws):
        funckey = m['type']
        if(not self.messagemapper.has_key(funckey) ):
            print '=== api error ==='
        self.messagemapper[funckey](padname, username, m['content'], ws)

    def prepareMessageHandler(self, padname, username, m, ws):
        print 'prepare input: %s' % str(m)
        if(m['subtype']=='update-me'):
            self.pads[padname].getuser(username).updatestatus(m['subcontent'])
        pass
        
    def lagMessageHandler(self, padname, username, m, ws):
        # 立刻回发消息                
        ws.write_message(buildPackage('lag', m))
        
	def undefineMessageHandler(self):
		print 'undefine key'
		
    def userleave(self, padname, username):
        pass
            

class Pad(object):
    users = {}

    def __init__(self, name):
        self.name = name
        
    def userlist(self):
        for k in self.users.keys():
            pass

    def getuser(self, username):
        return self.users[username]

    def adduser(self, username, ws):
        nu = User(username, ws, self)        
        self.users[username] = nu
        c = {}
        c['subtype'] = 'init-userlist'
        c['subcontent'] = [ {'name':u[0], 'status':u[1].getstatus()} 
            for u in self.users.items()]        
        nu.send(buildPackage('prepare', c))

    def broadcast(self, exc, message):
        for k in self.users.keys():
            if(not k in exc):
                self.users[k].send(message)

class User(object):
    name = ''
    ws = None
    status = {}

    def __init__(self, name, ws, pad):
        self.name = name
        self.ws = ws
        self.pad = pad

    def getstatus(self):
        return self.status

    def updatestatus(self, status):
        self.status = status
        print 'user: %s, status: %s' % (self.name, str(self.status))
        self.pad.broadcast([self.name], json.dumps({
                'type': 'user-update',
                'content': {
                    'name': self.name,
                    'status': self.status
                }
            }))

    def send(self, message):
        self.ws.write_message(message)

class UserReqHandler(tornado.web.RequestHandler):
    def post(self):
        username = self.get_argument('user')
        padname = self.get_argument('pad')
        self.render('pad_status.html', users=[], n=username, p=padname)

manager = manager()
