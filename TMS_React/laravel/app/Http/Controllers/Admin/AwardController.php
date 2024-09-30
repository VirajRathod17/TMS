<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Award;
use DataTables;

class AwardController extends Controller
{

    public function __construct()
    {
        $this->moduleSlug = "awards";

        // Links
        // $this->listUrl = route($this->moduleSlug . ".index");
        // $this->addUrl = $this->moduleSlug . '/create';
        // $this->editUrl = $this->moduleSlug . '/{id}/edit';

        // Model and Module name
        $this->module = "awards";
        $this->modelObj = new Award;
        // $this->sponsermodelObj = new Sponsor;

        $this->viewBase = 'Admin.' . $this->moduleSlug;
    }

    public function index()
    {
        
    }

    public function create(Request $request)
    {
        echo '<pre>';
        print_r($request->all());
        echo '</pre>';
        exit();
    }

    public function store(Request $request)
    {
        // echo '<pre>';
        //     print_r($request->all());
        //     echo '</pre>';
        // exit();

        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:100',
            'year' => 'required|string|min:4|max:4',
            'award_date' => 'required|date',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'required|string',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        try {
            // Create a new Award record
            $award = Award::create([
                'name' => $request->name,
                'year' => $request->year,
                'award_date' => $request->award_date,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'location' => $request->location,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Award created successfully',
                'data' => $award,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the award',
            ], 500);
        }
    }

    public function show($id)
    {

    }
    
    public function edit($id)
    {

    }

    public function update(Request $request, $id)
    {

    }

    public function destroy($id)
    {

    }

    public function getAwardsDatatable(Request $request)
    {
        $queryBuilder = $this->modelObj::query();

        // Default order by created_at if no order is specified by DataTables
        if (!$request->has('order')) {
            $queryBuilder->orderBy('year', 'desc');
        }

        return DataTables::eloquent($queryBuilder)

            ->filterColumn('award_date', function ($query, $keyword) use ($request) {
                $startDate = $request->from_date ?? '';
                $endDate = $request->to_date ?? '';
                // $date_format = CommonTrait::getDateFormat();

                if ($startDate !== '' && $endDate !== '') {
                    $from_date = \Carbon\Carbon::createFromFormat($date_format, $startDate)->format('Y-m-d');
                    $to_date = \Carbon\Carbon::createFromFormat($date_format, $endDate)->format('Y-m-d');
                    $query->whereDate('tbl_awards.award_date', '>=', $from_date)->whereDate('tbl_awards.award_date', '<=', $to_date);
                } elseif ($startDate !== '') {
                    $from_date = \Carbon\Carbon::createFromFormat($date_format, $startDate)->format('Y-m-d');
                    $query->whereDate('tbl_awards.awrd_date', '>=', $from_date);
                } elseif ($endDate !== '') {
                    $to_date = \Carbon\Carbon::createFromFormat($date_format, $endDate)->format('Y-m-d');
                    $query->whereDate('tbl_awards.award_date', '<=', $to_date);
                } else {
                    $query->whereRaw("DATE_FORMAT(tbl_awards.award_date, '%d/%m/%Y %H:%i') LIKE ?", ["%$keyword%"]);
                }
            })
            ->editColumn('award_date', function ($queryBuilder) {
                $date_format = 'd/m/Y'; // Define your date format
                return date($date_format, strtotime($queryBuilder->award_date));
            })
            ->addColumn('action', function ($queryBuilder) {
                $actionButtons = '';
                $actionButtons .= '<div class="btn-group">
                                    <a href="' . route($this->moduleSlug . '.edit', $queryBuilder->id) . '" class="btn-info btn btn-sm btn-icon" title="Edit"><i class="fas fa-edit"></i></a>
                               </div> ';
                $actionButtons .= '<div class="btn-group">
                                    <a href="' . route($this->moduleSlug . '.destroy', $queryBuilder->id) . '" data-id="' . $queryBuilder->id . '" data-kt-docs-table-filter="delete_row" class="btn-danger btn btn-sm btn-icon btn-delete-record" title="Delete"><i class="fas fa-trash"></i></a>
                               </div> ';
                return $actionButtons;
            })
            ->rawColumns(['award_date', 'action'])
            ->toJson();
    }
}