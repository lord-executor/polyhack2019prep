#!/bin/bash

docker run -it --rm --net host -v /dev/ydlidar:/dev/ydlidar --privileged --env ROS_MASTER_URI=http://192.168.43.66:11311 --name ourcode ourcode:latest /bin/bash

