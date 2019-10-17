import picamera
import picamera.array
from time import sleep

with picamera.PiCamera() as camera:
    camera.resolution = (320, 240)

    while True:
        with picamera.array.PiRGBArray(camera) as output:
            camera.capture(output, 'rgb')
            output = output.array

            # You can now treat output as a normal numpy array
            # Do your magic here

            sleep(1)