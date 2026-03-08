<?php

namespace App\Enums;

enum ConversationStatus: string
{
    case Active = 'active';
    case Completed = 'completed';
    case Abandoned = 'abandoned';
}
