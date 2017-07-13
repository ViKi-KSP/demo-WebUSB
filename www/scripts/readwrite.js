(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let led1 = document.getElementById('led1'),
        led1Status = document.getElementById('led1-output'),
        led2 = document.getElementById('led2'),
        led2Status = document.getElementById('led2-output');
        readStatus = document.getElementById('read-value');

    let port;

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = 'Disconnect';

        port.onReceive = data => {
          let textDecoder = new TextDecoder(),
              info = textDecoder.decode(data);
          if (info == 'Y' or info == 'N')
              readStatus.innerHTML = (info=='Y') ? '<strong> Key Pressed </strong>' : 'None'
          console.log(textDecoder.decode(data));
        }
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        statusDisplay.textContent = error;
      });
    }

    function writeToDevice() {
      // if (!port) {
      //   return;
      // }

      let view = new Uint8Array(2);
      view[0] = led1.checked ? 1 : 0;
      led1Status.innerText = led1.checked ? 'ON' : 'OFF';
      view[1] = led2.checked ? 1 : 0;
      led2Status.innerText = led2.checked ? 'ON' : 'OFF';

      console.log(view);
      port.send(view);
    };

    led1.addEventListener('change', writeToDevice);
    led2.addEventListener('change', writeToDevice);

    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          statusDisplay.textContent = error;
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        statusDisplay.textContent = 'No device found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });
  });
})();
