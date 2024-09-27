<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Award;

class AwardController extends Controller
{
    public function index()
    {
        
    }

    public function store(Request $request)
    {
        echo '<pre>';
            print_r($request->all());
            echo '</pre>';
        exit();
    }
}