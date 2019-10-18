#!/usr/bin/env python

import os
import rospy
from duckietown import DTROS
from std_msgs.msg import String
from sensor_msgs.msg import Joy

class MyNode():

    def __init__(self, node_name):
        # initialize the DTROS parent class
        #super(MyNode, self).__init__(node_name=node_name)
        # construct publisher
        self.pub = rospy.Publisher('/elcaduck/joy', Joy, queue_size=1)
        rospy.init_node('run_duckie_run', anonymous=True)

    def run(self):
        # publish message every 1 second
        rate = rospy.Rate(1) # 1Hz
        data = ["one", "two", "three", "four"]
        buttons = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        while not rospy.is_shutdown():
        #for x in data:
            print("x")
            axes = [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
            message = Joy(header=None, axes=axes, buttons=buttons)
            self.pub.publish(message)
            rate.sleep()
        
        print("done")
        message = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        message = Joy(header=None, axes=axes, buttons=buttons)
        self.pub.publish(message)

if __name__ == '__main__':
    # create the node
    node = MyNode(node_name='my_node')
    # run node
    node.run()
    # keep spinning
    rospy.spin()