<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
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

    public function updateProfile(Request $request)
    {
        // Authenticate user
        $user = JWTAuth::parseToken()->authenticate();
    
        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:tbl_admin,email,' . $user->id, 
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ],
        [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Email is invalid',
            'email.unique' => 'This email is already taken',
            'image.image' => 'The file must be an image',
            'image.mimes' => 'Allowed image formats are jpeg, png, jpg, gif',
            'image.max' => 'Image size must be less than 2MB',
        ]);
    
        // Check if validation fails
        if ($validator->fails()) {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = $validator->errors()->first();
            return response()->json($this->responseData);
        }
    
        try {
           
            $user->name = $request->input('name');
            $user->email = $request->input('email');
    
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
    
                // path
                $imagePath = 'admin/profile/' . $user->id;
    
                // Create the directory if it doesn't exist
                if (!file_exists(public_path($imagePath))) {
                    mkdir(public_path($imagePath), 0777, true);
                }
    
                // Generate a unique image name with random number
                $randomNumber = rand(100000, 999999); 
                $imageName = $randomNumber . '_' . time() . '.' . $image->getClientOriginalExtension();
    
                $image->move(public_path($imagePath), $imageName);
    
                // Save 
                $user->image = $imageName;
            }
    
            $user->save();
    
            // Return success response
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = 'Profile updated successfully';
            $this->responseData['data'] = $user; 
            return response()->json($this->responseData);
    
        } catch (\Exception $e) {
            // Handle any errors
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = 'Profile update failed. Please try again.';
            return response()->json($this->responseData);
        }
    }
    

}
