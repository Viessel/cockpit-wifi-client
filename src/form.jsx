import React from 'react';
import { WifiInfo } from './wifiInfo.jsx';
import { Form, FormGroup, TextInput, Checkbox, Tooltip, ActionGroup, Button, Select, SelectOption, SelectList, MenuToggle } from '@patternfly/react-core';
import SyncAltIcon from '@patternfly/react-icons/dist/esm/icons/sync-alt-icon';

const connect = (ssid, password, autoconnect, dhcp, ip = "", mask = "", gateway = "") => {
  console.log(ssid, password, autoconnect, dhcp, ip, mask, gateway);
  cockpit.spawn(["nmcli", "dev", "wifi", "connect", ssid, "password", password ], { superuser: "no" })
    .then((r) => {
      console.log(r)
    })
}

export const FormBasic = () => {
    const [ssid, setSsid] = React.useState('');
    const [autoconnect, setAutoconnect] = React.useState(true);
    const [password, setPassword] = React.useState('');
    const [dhcp, setDhcp] = React.useState(true);
    const [ip, setIp] = React.useState('');
    const [mask, setMask] = React.useState('');
    const [gateway, setGateway] = React.useState('');
    const [update, setUpdate] = React.useState(0);
    const [infoKey, setInfoKey] = React.useState(0);

    const handlePasswordChange = (_event, password) => {
        setPassword(password);
    };
    const handleIpChange = (_event, ip) => {
        setIp(ip);
    };
    const handleMaskChange = (_event, mask) => {
        setMask(mask);
    };
    const handleGatewayChange = (_event, gateway) => {
        setGateway(gateway);
    };
    const [ssidItems, setSsidItems] = React.useState([]);

    React.useEffect(() => {
        const loadSsidItems = async () => {
            const data = await cockpit.script(["/home/viesel/repoman/starter-kit/src/nmcli-scan.sh"]);
            const json = JSON.parse(data);
            setSsidItems(json);
        };
        loadSsidItems()
                .catch(err => {
                    console.log(err);
                });
    }, [update]);
    const [isOpen, setIsOpen] = React.useState(false);
    const onToggleClick = () => {
        setIsOpen(!isOpen);
    };
    const onSelect = (_event, value) => {
        console.log('selected', value);
        setSsid(value);
        setIsOpen(false);
    };
    const toggle = toggleRef => <MenuToggle
      ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen} style={{
          width: '200px'
      }}
    >
        {ssid}
    </MenuToggle>;
    return (
        <Form>
            <div key={infoKey}>
                <WifiInfo />
            </div>
            <FormGroup
label="Nombre de la Red"
               labelIcon={<Tooltip content={<div> Actualizar
                                            </div>}
               >
                   <button type="button" aria-label="nombre de la red wifi a conectarse" onClick={e => { e.preventDefault(); setUpdate(update + 1); console.log(update) }} aria-describedby="form-name-01" className="pf-v5-c-form__group-label-help">
                       <SyncAltIcon />
                   </button>
                          </Tooltip>} isRequired fieldId="ssid"
            >

                <Select id="ssid" isOpen={isOpen} selected={ssid} onSelect={onSelect} onOpenChange={isOpen => setIsOpen(isOpen)} toggle={toggle} shouldFocusToggleOnSelect>
                    <SelectList>
                        {Object.keys(ssidItems).map((key) => {
                            return (
                                <SelectOption key={ key } value={ ssidItems[key] }>
                                    { ssidItems[key] }
                                </SelectOption>
                            );
                        })}
                    </SelectList>
                </Select>
                <Checkbox label="Autoconectar" aria-label="autoconnect" id="autoconnect-checkbox" onChange={ () => setAutoconnect(!autoconnect)} isChecked={autoconnect} />
            </FormGroup>
            <FormGroup label="Contraseña" isRequired fieldId="password-field">
                <TextInput isRequired type="text" id="password" name="simple-form-email-01" value={password} onChange={handlePasswordChange} />
            </FormGroup>
            <FormGroup role="group" fieldId="basic-form-checkbox-group" label="Configuracion de IP">
                <Checkbox label="DHCP" aria-label="DHCP" id="dhcp-checkbox" onChange={ () => setDhcp(!dhcp)} isChecked={dhcp} />
            </FormGroup>
            <FormGroup label="IP" isRequired={!dhcp} fieldId="simple-form-phone-01">
                <TextInput isRequired={!dhcp} type="ip" id="ip" name="form-ip-01" placeholder="192.168.1.100" value={ip} onChange={handleIpChange} isDisabled={dhcp} />
            </FormGroup>
            <FormGroup label="Mascara de subred" isRequired={!dhcp} fieldId="simple-form-phone-01">
                <TextInput isRequired={!dhcp} type="mask" id="mask" name="form-mask-01" placeholder="24" value={mask} onChange={handleMaskChange} isDisabled={dhcp} />
            </FormGroup>
            <FormGroup label="Puerta de enlace" isRequired={!dhcp} fieldId="simple-form-phone-01">
                <TextInput isRequired={!dhcp} type="gateway" id="gateway" name="form-gateway-01" placeholder="192.168.1.1" value={gateway} onChange={handleGatewayChange} isDisabled={dhcp} />
            </FormGroup>
            <ActionGroup>
                <Button variant="primary" onClick={ connect.bind(null, ssid, password, autoconnect, dhcp, ip, mask, gateway) }>Conectar</Button>
            </ActionGroup>
        </Form>
    );
};
