# -*- coding: utf-8 -*-
import tornado.web

class PrepareStageModule(tornado.web.UIModule):
    def render(self):
        return self.render_string('modules/book.html', book=book)