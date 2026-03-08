<?php

namespace App\Enums;

enum PaymentType: string
{
    case Subscription = 'subscription';
    case OneTime = 'one_time';
}
