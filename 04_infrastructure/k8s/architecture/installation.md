For Kubernetes, it's a series of

different containers. We've talked about that. On top of

that, you have a command line tool that's

not necessarily bundled with those containers that run on

the server. So, you've got some more parts than Docker

would normally have, and there's different ways to set this

up. In fact, there's tons and tons of ways to install

Docker. There's lots of distribution.

There's lots of installer tools.

Each way will be slightly different and package different

containers. Largely there's going to be the same four

or five containers that you have to deal with. We're really

focused just on learning right now.

So, I want to get you the local setup, the

easiest way for you to use. There's certain other things

that I look at, too, for the best way to install is, what

is RAM utilization and is it easy to turn off?

Because these are things where you've got a lot of

containers running in the background. You may not want

those to always be running. You know, how is it easy?

Is it easy to reset it?

Is it easy to use with my local system?

Rather than just always having to refer to some foreign

endpoint somewhere else. With Docker

Desktop, if you have Docker Desktop, that's

the best way to go. That's the easiest install of all

Kubernetes. If you have Docker Desktop, just use that.

If you have Docker Toolbox, then you're probably going to

want to use minikube, which is very similar to the Docker

Machine command line, which is what makes Docker Toolbox

work. We'll talk about that in a minute.

If you're someone who's got Linux on your desktop or you

just want to do this natively in a Linux VM you've already

created, either on your machine or on the Internet, then

the easiest way there to probably set it up for learning

purposes is Microk8s.

It's made by Ubuntu, but you can install it on a

lot of different distributions. It's not specific to just

Ubuntu. If you're just not at

a place where you can install Kubernetes, or you don't want

to create a cloud VM or whatever, and you just want to

learn it in a browser, that's fine too.

There's two good options one of them is play-with-k8s,

which is made by the same group as

play-with-docker. Then there's katacoda.

Katacoda is very similar.

In fact, if you looked at both of these tools, they look

like they do the same thing.

The slight difference there is that the

play-with-k8s requires that you actually install the

cluster and set it up.

Katacoda already provides the setup for you.

It's, I think, a better tool to learn with

because it doesn't require you to worry about installation,

which you might just wait later to learn how to do that and

just focus on how it works, what the command lines look

like, and stuff like that. If you had to choose between one

or the other, look at the resources of this lecture for

the link to the katacoda playground.

For me, I would prefer Docker Desktop because

it provides me several things out-of-the-box. One, it's a checkbox

to install Kubernetes on my existing Docker setup.

Whatever the Linux VM is on Mac or Windows, it's

going to automatically add the Kubernetes setup to that.

Then it's also going to install the kubectl command

line on my local machine, whether it's Mac or Windows, and

make sure that version is the right version to match to the

server. In fact, if using Docker Desktop Enterprise, which

is a new paid offering from Docker, they

actually allow you to swap between different versions of

Kubernetes on the fly in case you're maybe in

an Enterprise environment that is specific to different

clusters running different versions, and you want to test

different versions locally very easily. Most of us won't

need to do that. So, the free version of Docker Desktop

works just fine like you use in the rest of this course.

The other nice little thing there is that Kubernetes uses

up a decent amount of resources on your machine.

Docker is already using resources so it's sometimes

a little tight to also running Kubernetes on top of that

and then get the rest of your work done.

So, Docker Desktop provides

a quick little checkbox in the menus to allow you to

disable the Kubernetes part of the cluster while still

leaving Docker running.

That's a neat option because sometimes I just want Docker

and I don't need Kubernetes.

All right. Next up, if you're a Docker Toolbox person,

minikube is the closest replacement to that.

It doesn't even need Docker Toolbox to

be installed, so you could totally just run this

separately.

It's very similar in the way that Docker Toolbox works.

I think for those of you using Toolbox, this

will be a similar experience. You would download the

installer on Windows for the minikube

binary and it would install that.

You could just download the binary directly from GitHub or

you could just download the installer.

I kind of like the installer just because that's the

Windows way of installing things.

You can also get it off Chocolatey, if you're into that.

Regardless of which method you get it downloaded, it's a

single binary, and once you get it there, you just type

minikube start. That assumes you have BirtualBox installed,

which if you have Docker Toolbox, VirtualBox would

have been installed already. The nice thing is, is this

uses that same virtualization backend by default.

The other thing is that the commands of it are very similar

to Docker Machine as well. You start.

You can remove a machine.

You can reboot the machine. You can do all those typical

things like you could with Docker Toolbox.

But the one gap here is that it doesn't install the

Kubernetes command line that you would most often use,

kubectl, which is what we're going to use throughout the

rest of this section.

So, you're going to have to go and install that separately,

which is just its own single binary.

There's multiple ways to install it.

In fact, when the minikube is finished setting up,

it will give you a URL that you can go find the

instructions on how to do that.

All of this really shouldn't take you very long.

All in all, it's really just VirtualBox and a couple of

executables on your machine and away you'll go.

You'll have the VM running. It'll have kubectl on your on

your Windows machine that talks to that VM, and then you're

ready to start. For those of you that are on Linux

as your host OS, or you just installed your own

Linux VM, or maybe using a Linux VM in the cloud, the

easiest way I think to get Kubernetes running on that

machine is to use Microk8s, which is

from Canonical, the company that makes Ubuntu, but

it works on any Linux distribution, I think.

I checked the list and it was pretty comprehensive.

It installs using Snap.

If you're not familiar with Snap, it's a different type of

installation technology, but does the same thing is

apt-get or Yum.

You just have to get Snap installed first.

If you don't already have it, you can just type snap and if

it says it can't find the program, then you know you don't

have Snap installed.

You can probably find Snap in apt-get

or Yum. Once you have that, you would use a Snap command

to install the Microk8s.

Once you've done that, it will do everything else for you.

It will install all the different master roles.

It will automatically install the correct version of

kubectl. It gives you a nice set of commands to

manage the Kubernetes system with

microk8s.something. You can do microk8s.enable

and other different commands. If you just type microk8s.

and hit your Tab key a couple of times, you'll see

it list out all the various options.

It's easy to manage that, even uninstall it pretty

quickly if you don't want Kubernetes anymore.

The one quirk with this one is it doesn't give you the

default kubectl out-of-the-box.

I think that's to keep it from conflicting with...maybe if

you have kubectl already installed, it gives you a new

command that is the microk8s.kubectl.

What I recommend is if using Bash or Zsh is

to go in to your profile that automatically runs

every time you log in and simply add an alias

so that you can type kubectl and it will control

this cluster. As we go through the examples with that

command line, I don't want you to keep forgetting that oh

yeah, on my machine, I have to type microk8s.kubectl,

right. So, you definitely want to make that alias.

I always do that. A little tip there is I actually

just make my alias the letter K, so I didn't have to type

kubectl. I can just type K and then something else,

right. You could do that as well instead of the full word

kubectl. That's maybe something you do later once you've

got all this stuff down.
