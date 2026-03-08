<?php

namespace App\Enums;

enum PaymentProvider: string
{
    case Esewa = 'esewa';
    case Khalti = 'khalti';
    case ConnectIps = 'connect_ips';
}
