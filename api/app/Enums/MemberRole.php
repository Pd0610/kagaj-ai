<?php

namespace App\Enums;

enum MemberRole: string
{
    case Director = 'director';
    case Shareholder = 'shareholder';
    case Secretary = 'secretary';
    case Auditor = 'auditor';
    case Partner = 'partner';
    case Proprietor = 'proprietor';
}
