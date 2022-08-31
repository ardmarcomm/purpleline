<?php

        require_once('authorization.php');

        if (isAuthorized($ip)) {
                file_put_contents('purpleline.json', file_get_contents('php://input'));
                echo '{"success": true, "message": "This IP is authorized. Save worked!"}';
        }
        else {
                echo '{"success": false, "message": "This IP is not authorized. Try the VPN?", "ip": "' . $ip . '"}';
        }

?>