<?php

namespace App\Enums;

enum DocumentStatus: string
{
    case Draft = 'draft';
    case Generating = 'generating';
    case Completed = 'completed';
    case Failed = 'failed';
}
