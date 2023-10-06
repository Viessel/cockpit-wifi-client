#!/bin/sh
ssid_list='{'
index=0
scan=$(nmcli -e no -g ssid dev wifi list --rescan yes)
IFS=$'\n'
for line in $scan; do
  index=$((index+1))
  ssid_list=${ssid_list}\"${index}\":\"${line}\",
done
echo ${ssid_list/%,/\}}
