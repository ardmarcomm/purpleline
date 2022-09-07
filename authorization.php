<?php

$ip = $_SERVER['REMOTE_ADDR'];

function isAuthorized($ip) {
        $authorized = false;
        $ranges = array(
                '129.105.0.0/16',
                '129.105.212.0/24',
                '129.105.216.0/24',
                '192.26.87.0/24',
                '192.26.86.0/24',
                '165.124.0.0/16',
                '99.99.0.0/16',
                '165.124.167.2/16',
                '199.74.64.0/18',
                '10.120.224.0/19');

        foreach ($ranges as $range) {
                if (cidr_match($ip, $range)) {
                        $authorized = true;
                }
        }

        // Localhost
        if ($ip == '::1') {
                $authorized = true;
        }

        return $authorized;
}

function cidr_match($ip, $cidr) {
            list($subnet, $mask) = explode('/', $cidr);

            if ((ip2long($ip) & ~((1 << (32 - $mask)) - 1) ) == ip2long($subnet))
            {
                return true;
            }

            return false;
        }

 ?>
