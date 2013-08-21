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

from tornado.options import define, options

import sys
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter

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


class PadHandler(tornado.web.RequestHandler):
    def get(self, input):
        print self
        self.render('pad.html', title=input, code_text=code,
                    users=['1', '2', '3'])


class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print "WebSocket opened"

    def on_message(self, message):
        self.write_message(u"You said: " + message)

    def on_close(self):
        print "WebSocket closed"


if __name__ == '__main__':
    tornado.options.parse_command_line()
    app = tornado.web.Application(
        handlers=[(r'/', IndexHandler),
                  (r'/poem', PoemPageHandler),
                  (r'/p/(\w+)', PadHandler),
                  (r'/ws/', EchoWebSocket)
                  ],
        template_path=os.path.join(os.path.dirname(__file__), "templates"),
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        autoscaping=None,
        debug=True
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
