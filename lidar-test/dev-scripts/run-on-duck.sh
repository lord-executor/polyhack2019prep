#!/bin/bash

docker -H elcaduck.local run -it -v /dev/ydlidar:/dev/ydlidar --privileged --rm --net=host duckietown/polyhack2019prep:master-arm32v7
