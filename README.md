# Guru Message

## Idea
Yes, there are already Guru Meditation clones/remakes around and also used in recent ESP32 hardware, or DS homebrew not only Amiga.

OK, most of the time we disliked the Gurus but for a dev they should be helpful.

That's the purpose of this project.

## Modern way
Just displaying crazy numbers doesn't help and for web devs it is more important to also see remote errors, not only the ones from the machine you sit in front of. Which should work flawless of course ;)

That's why the my Guru is a split personality. One half is the visual message for the person in front of the app, while the other half is mail to dev and inform that an error occured in his software. A bit of telemetry.

Both are configurable. For example while developing you maybe do not want mails, but in production you maybe do not want to show errors to users instead get an information about this event.

## Client / Show
It's the blinking box on top of the screen. You will notice.

## Server / Send
For all cases without access to server side scripts i picked GAS Google App Script as very simple example to send out mails.

This is not best practise for production, please use own PHP/NodeJS/whatever you prefer.

## Browser Compatibility
Most major browsers, even IE11.

## License
Public Domain
