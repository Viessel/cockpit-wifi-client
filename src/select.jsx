import React from 'react';
import { Select, SelectOption, SelectList, MenuToggle } from '@patternfly/react-core';
export const SelectOptionVariations = () => {
    const [ssidItems, setSsidItems] = React.useState([]);

    React.useEffect(() => {
        const loadSsidItems = async () => {
            const data = await cockpit.spawn(["nmcli", "-t", "-e", "no", "-g", "SSID", "dev", "wifi", "list", "--rescan", "yes"], { latency:"100000" });

            const arr = data.split("\n");
            const json = arr.map((item, index) => {
                return {
                    key: index,
                    value: item
                };
            });
            setSsidItems(json);
        };

        loadSsidItems()
                .catch(err => {
                    console.log(err);
                });
    }, []);
    const [isOpen, setIsOpen] = React.useState(false);
    const [selected, setSelected] = React.useState('Select a value');
    const onToggleClick = () => {
        setIsOpen(!isOpen);
    };
    const onSelect = (_event, value) => {
        console.log('selected', value);
        setSelected(value);
        setIsOpen(false);
    };
    const toggle = toggleRef => <MenuToggle
      ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen} style={{
          width: '200px'
      }}
    >
        {selected}
    </MenuToggle>;

    return (
    );
};
