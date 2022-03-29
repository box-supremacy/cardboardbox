#!/usr/bin/env zsh

# Fetch changes and get the amount of changes made
git fetch
CHANGE_AMT=$(git rev-list --left-right --count master...origin/master | sed -e '1s/^.//' | sed -e 's/^[ \\t\t]*//')

# Pull changes from repo
OUTPUT=$(git pull --force)

# If there were changes, rerun the bot
if [[ ${OUTPUT} != *"Already up to date"* && ${CHANGE_AMT} != 0 ]]; then
	echo "Changes detected, restarting bot."

    . ./restartbot.sh

    echo "Bot updated on $(TZ='America/New_York' date "+%A, %d %B %Y at %H:%M"). ${CHANGE_AMT} changes since last update." >> $HOME/autopull.log
else
	echo "Already up to date."
fi
