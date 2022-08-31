<?php

        require_once('authorization.php');

        if (isAuthorized($ip)) {
                date_default_timezone_set('America/Chicago');
                $date = date('Y-m-d H-i');

                file_put_contents('last-purpleline.json', file_get_contents('php://input'));
                echo '{"success": true}';
        }
        else {
                echo '{"success": false, "message": "This IP is not authorized. Try the VPN?", "ip": "' . $ip . '"}';
        }

 ?>