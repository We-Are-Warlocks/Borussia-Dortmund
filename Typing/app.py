# -*- coding: utf-8 -*-
"""
Created on Wed Aug 07 16:38:33 2013

@author: Jin-yc10-PC
"""

import os.path

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import json
from tornado.options import define, options

import sys
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
import module.users as userm

define("port", default=8000, help="run on the given port", type=int)


def code2html(code, lang):
    lexer = get_lexer_by_name(lang, encoding='utf-8', stripall=True)
    formatter = HtmlFormatter(
            linenos=False,
            encoding='utf-8',
            noclasses="True")
    result = highlight(code, lexer, formatter)
    return result

f = open(__file__)
code = f.read()
f.close()
codehtml = code2html(code, 'python')


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')


class PoemPageHandler(tornado.web.RequestHandler):
    def post(self):
        noun1 = 'noun1' + self.get_argument('noun1')
        noun2 = 'noun2' + self.get_argument('noun2')
        verb = self.get_argument('verb')
        noun3 = self.get_argument('noun3')
        self.render('form.html', roads=noun1, wood=noun2,
                    made=verb, difference=noun3)


class FileReqHandler(tornado.web.RequestHandler):
    def get(self):
        noun1 = 'noun1' + self.get_argument('noun1')
        noun2 = 'noun2' + self.get_argument('noun2')
        verb = self.get_argument('verb')
        noun3 = self.get_argument('noun3')
        self.render('form.html', roads=noun1, wood=noun2,
                    made=verb, difference=noun3)

useabletype = ['py', 'xml']


class PadHandler(tornado.web.RequestHandler):

    def getFilelist(self):
        filelist = []
        list_dirs = os.walk(os.path.dirname(__file__))
        for root, dirs, files in list_dirs:
            for f in files:
                temp = {}
                temp['name'] = f
                temp['path'] = os.path.join(root, f)
                post = f.split('.')[-1]
                if(post in useabletype):
                    filelist.append(temp)
        return filelist

    def post(self, pad):
        username = self.get_argument('user')
        padname = self.get_argument('pad')
        self.render('pad.html', title=username, code_text=code[:300],
                    users=['1', '2', '3'], files=self.getFilelist())

    def get(self, _user, _pad):
        self.render('pad.html',
                    title=_pad, code_text=code[:300],
                    users=userm.userManager.getUserList(_pad), __user=_user,
                    __pad=_pad, files=self.getFilelist(),
                    )


class WebSocket(tornado.websocket.WebSocketHandler):

    pad=''
    user=''

    def open(self):
        print "WebSocket opened"

    def on_message(self, message):
        m = json.loads(message)
        if(m['type'] == 'request-file'):
            with open(m['content']) as fo:
                string = fo.read()
                r = {}
                r['type'] = 'response-file'
                r['content'] = string[:300]
                self.write_message(json.dumps(r))
        elif(m['type'] == 'incoming-user'):
            self.pad = m['content']['pad']
            self.user = m['content']['user']
            print self.user+'@'+self.pad+' just arrived!'
            userm.userManager.userArrived(self.user, self.pad, self)
        elif(m['type'] == 'pad-message'):
            userm.userManager.broadCastPadMessage(
                self.pad, self.user, m)
        elif(m['type'] == 'lag'):
                r = {}
                r['type'] = 'lag'
                r['content'] = ""
                self.write_message(json.dumps(r))

    def on_close(self):
        print "WebSocket closed"
        print self.user+'@'+self.pad+' just gone!'
        userm.userManager.userLeave(self.user, self.pad, )


class LanguageHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('lex.html')

if __name__ == '__main__':
    tornado.options.parse_command_line()
    app = tornado.web.Application(
        handlers=[(r'/', IndexHandler),
                  (r'/poem', PoemPageHandler),
                  (r'/f', FileReqHandler),
                  (r'/p/(\w+)/(\w+)', PadHandler),
                  (r'/ws/', WebSocket),
                  (r'/u', userm.UserReqHandler),
                  (r'/l', LanguageHandler)
                  ],
        template_path=os.path.join(os.path.dirname(__file__), "templates"),
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        autoscaping=None
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
