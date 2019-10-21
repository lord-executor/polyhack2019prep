#!/bin/bash

set -e

# YOUR CODE BELOW THIS LINE
# ----------------------------------------------------------------------------

#roslaunch ydlidar lidar.launch
rostopic list
rosrun ydlidar ydlidar_node
