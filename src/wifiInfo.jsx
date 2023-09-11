import React from 'react';
import { Alert } from '@patternfly/react-core';

export const WifiInfo = () => {
    const [state, setState] = React.useState([]);
    React.useEffect(() => {
        const keys = ["Conexión Activa", "Estado", "Dirección IP"];
        const loadState = async () => {
            const data = await cockpit.spawn(["nmcli", "-t", "-e", "no", "-g", "general.connection,general.state,ip4.address", "device", "show", "wlp0s20f3"], { latency:"10000" });
            const arr = data.split("\n");
            const json = arr.map((item, index) => {
                return {
                    key: keys[index],
                    value: item
                };
            });
            setState(json);
        };
        loadState()
                .catch(err => {
                    console.log(err);
                });
    }, []);

    return (
        <Alert
        variant="info"
        title={ state.map((item) => {
            return (
                cockpit.format("$0: \t $1\n", [item.key, item.value])
            );
        })}
        />
    );
};
