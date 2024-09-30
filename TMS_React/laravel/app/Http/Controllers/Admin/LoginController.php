<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
class LoginController extends Controller
{
    public function login(Request $request)
    {
         // Validate request data
         $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'password' => 'required',
        ],
        [
            'email.required'=> 'Email is required',
            'password.required'=> 'Password is required',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = $validator->errors()->first();
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }

         // Find the admin by email
         $admin = Admin::where('email',$request->email)->first();
           // Check if admin exists and if the password matches
        if ($admin && Hash::check($request->password, $admin->password)) {
            // Generate JWT token
            $token = JWTAuth::fromUser($admin);
        
            // Return success response
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Login successful";
            $this->responseData['token'] = $token;
            return response()->json($this->responseData);
        } else {
            // Return error if email or password is invalid
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "Invalid email or password";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
    }

    public function logout(Request $request)
    {
        try {

            JWTAuth::invalidate(JWTAuth::parseToken());

            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Logout successful, token destroyed.";
            return response()->json($this->responseData);
        } catch (\Exception $e) {
            
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "Logout failed, unable to destroy token.";
            return response()->json($this->responseData);
        }
    }
}
