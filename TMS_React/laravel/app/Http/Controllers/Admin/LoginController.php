<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{

    /**
     * Logs in an admin user and returns a JWT token.
     * 
     * This endpoint validates the email and password of the admin user and returns a JWT token if the credentials are valid.
     * 
     * @author - Bansi,Isha
     * @param Request $request - The request object containing the email and password.
     * 
     * @return \Illuminate\Http\Response - A JSON response containing the JWT token or an error message.
     */
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
            // Update basic info
            $user->name = $request->input('name');
            $user->email = $request->input('email');

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                
                // Path where images are stored
                $imagePath = 'admin/profile/' . $user->id;
                
                // Check if user already has an image and delete the old one
                if ($user->image) {
                    $existingImagePath = public_path($imagePath . '/' . $user->image);
                    
                    if (file_exists($existingImagePath)) {
                        unlink($existingImagePath); // Delete old image
                    }
                }

                if (!file_exists(public_path($imagePath))) {
                    mkdir(public_path($imagePath), 0777, true);
                }

                // Generate a unique image name with random number
                $randomNumber = rand(100000, 999999); 
                $imageName = $randomNumber . '_' . time() . '.' . $image->getClientOriginalExtension();

                // Move the image to the user's profile directory
                $image->move(public_path($imagePath), $imageName);

                // Save the new image name in the database
                $user->image = $imageName;
            }

            $user->save();

            // Return success response
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = 'Profile updated successfully';
            $this->responseData['data'] = $user; // Optional, to return the updated user data
            return response()->json($this->responseData);

        } catch (\Exception $e) {
            // Handle any errors
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = 'Profile update failed. Please try again.';
            return response()->json($this->responseData);
        }
    }

    public function getProfile()
    {
        // Authenticate user
        $user = Auth::guard('api')->user();
    
        if (!$user) {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = 'User not found.';
            return response()->json($this->responseData, 404);
        }
    
        // Use the getImage function to retrieve the full image path
        $user->image = Admin::getImage($user->id, $user->image);
        
        // Return user data one by one
        $this->responseData['status'] = 'success';
        $this->responseData['message'] = 'Profile retrieved successfully.';
        $this->responseData['data'] = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'image' => $user->image,
            'award_id' => $user->award_id,
        ];
        
        return response()->json($this->responseData);
    }


    public function changePassword(Request $request)
    {
        // Authenticate user
        $user = JWTAuth::parseToken()->authenticate();

        // Validate request data
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ],
        [
            'current_password.required' => 'Current password is required',
            'new_password.required' => 'New password is required',
            'new_password.min' => 'New password must be at least 8 characters',
            'new_password.confirmed' => 'New passwords do not match',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = $validator->errors()->first();
            return response()->json($this->responseData);
        }

        // Check if the current password is correct
        if (!Hash::check($request->current_password, $user->password)) {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = 'Current password is incorrect.';
            return response()->json($this->responseData);
        }

        try {
            // Update the user's password
            $user->password = Hash::make($request->new_password);
            $user->save();


            $this->responseData['status'] = 'success';
            $this->responseData['message'] = 'Password changed successfully.';
            return response()->json($this->responseData);
        } catch (\Exception $e) {

            $this->responseData['status'] = 'error';
            $this->responseData['message'] = 'Password change failed. Please try again.';
            return response()->json($this->responseData);
        }
    }

    public function changeAwardYear(Request $request)
    {
        $user = Auth::guard('api')->user();

        if ($user) {
            $user->award_id = $request->award_id;
            $user->save();
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = 'Award year changed successfully.';
            $this->responseData['data'] = []; 
            return response()->json($this->responseData);
        }else {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = 'User not found.';
            $this->responseData['data'] = [];
            return response()->json($this->responseData, 404);
        }
    }

}
