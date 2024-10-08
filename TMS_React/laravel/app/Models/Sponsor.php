<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sponsor extends Model
{

    use HasFactory;

    protected $table = 'tbl_sponsers';

    protected $fillable = [
        'award_id',
        'slug',
        'name',
        'description',
        'website_link',
        'is_main_sponsor',
        'image',
        'company_name',
        'Intrest',
        'email',
        'contact_number',
        'status'
    ];

}
