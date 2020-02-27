1) Setup a virtual environment and connect to it
    a) First check supported Heroku Python runtimes: https://devcenter.heroku.com/articles/python-support
    b) Check the version of Python you want is supported, since we are using 3.7 we see Heroku (currently) supports 3.7.5
    c) conda create -n HerokuTest1 python=3.7  # create a new environment based on this version (without Anaconda!)
    d) activate that environment: conda activate HerokuTest1 # old version of conda supported "source activate HerokuTest1"

2) pip install flask gunicorn

3) try your app with gunicorn: gunicorn app:app

4) iteratively repeat step (f) after installing only the missing modules with pip
 ** in our example the module 'requests' also needed to be installed **

5) Create a plain text file called Procfile with the following content:
web: gunicorn --pythonpath flask app:app

6) Create a plain text file called runtime.txt with (from step (b) we know the Heroku supports 3.7.5) the following content:
python-3.7.5

7) Now we need to be able to tell Heroku what modules we need for our app to run (much like we did interatively above).  Fortunately,
once we know what we need, there is a shortcut:
pip freeze > requirements.txt
This creates a 'requirements.txt' file that has the modules (and their versions) that are needed to make this run.

8) In root directory of project:
git init 
git add .
git commit -m "some meaningful text"
heroku create
git push heroku master

9) Run the app with the URL heroku gives you! Done!