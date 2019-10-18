#!/usr/bin/env python

import sys
from PyQt5 import QtCore, QtGui, QtWidgets, uic
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QColor
import rospy
from std_msgs.msg import String


class MainWindow(QtWidgets.QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()

        self.text = "undefined"

        self.label = QtWidgets.QLabel()
        canvas = QtGui.QPixmap(400, 300)
        # canvas.fill(QColor(255, 0, 0, 127))
        self.label.setPixmap(canvas)
        self.setCentralWidget(self.label)
        self.draw_something()

        rospy.init_node("mygui", anonymous=True)
        rospy.Subscriber("chatter", String, self.receive)

    def draw_something(self):
        pixmap = self.label.pixmap()
        pixmap.fill(QColor(255, 0, 0, 127))
        painter = QtGui.QPainter(self.label.pixmap())
        painter.drawLine(10, 10, 300, 200)
        painter.drawText(0, 15, self.text)

        pen = QtGui.QPen()
        pen.setWidth(40)
        pen.setColor(QtGui.QColor('red'))
        painter.setPen(pen)
        painter.drawPoint(200, 150)

        painter.end()
    
    def receive(self, data):
        self.text = data.data
        self.draw_something()
        self.update()


app = QtWidgets.QApplication(sys.argv)
window = MainWindow()
window.show()
app.exec_()
