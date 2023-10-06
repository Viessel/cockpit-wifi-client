#!/usr/bin/bash
SSID=$1
if [[ -z $2 ]]; then
  PASSWORD=""
else
  PASSWORD="802-11-wireless-security.key-mgmt WPA-PSK 802-11-wireless-security.psk $2"
fi
if [[ $3 == 'true' ]]; then
  AUTOCONNECT=yes
  # Disable autoconnect for other connections
  for con_id in `nmcli c | grep -o -- "[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}"`;
    do nmcli connection mod uuid $con_id connection.autoconnect no ; done
else
  AUTOCONNECT=no
fi
DHCP=$4
IP=$5
MASK=$6
GATEWAY=$7
if [[ $DHCP == 'true' ]]; then
  nmcli con del "$SSID" 1&>/dev/null
  echo "nmcli con add type wifi ssid "$SSID" con-name "$SSID" autoconnect $AUTOCONNECT "$PASSWORD""
  nmcli con add type wifi ssid "$SSID" con-name "$SSID" autoconnect $AUTOCONNECT $PASSWORD
else
  nmcli con del "$SSID"
  nmcli con add type wifi ssid "$SSID" con-name "$SSID" autoconnect $AUTOCONNECT ip4 "$IP"/"$MASK" gw4 "$GATEWAY" $PASSWORD
fi
nmcli con up "$SSID"
