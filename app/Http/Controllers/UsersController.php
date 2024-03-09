<?php

namespace App\Http\Controllers;

use App\Helpers\EnvHelper;
use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\Role;
use App\Models\State;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;

class UsersController extends Controller
{
    /**
     * Display users listing
     */
    public function index(Request $request): Response
    {
        $searchValue = $request->input('search');
        $url = $request->url();
        $user = Auth::user();

        if($request->has('search')){
            $users = User::where('productive_unit_id', $user->productive_unit_id)
                ->where('deleted_at', null)
                ->where('document', 'LIKE', "%{$searchValue}%")
                ->orWhere('name', 'LIKE', "%{$searchValue}%")
                ->orderBy('name', 'asc')
                ->paginate(10);
        }
        else {
            $users = User::where('productive_unit_id', $user->productive_unit_id)
                ->where('deleted_at', null)
                ->orderBy('name', 'asc')
                ->paginate(10);
        }

        return \inertia('Users/Index', [
            'users' => $users,
            'request' => $request,
            'url' => $url,
            'baseUrl' => url('/'),
            'createUserUrl' => route('user.create'),
            'csrfToken' => csrf_token()
        ]);
    }

    /**
     * Display the create new user form
     * @return Response
     */
    public function create(): Response
    {
        $roles = Role::where('id', '>', 1)->get();

        return \inertia('Users/Create', [
            'roles' => $roles,
            'usersUrl' => url('/users'),
            'formActionUrl' => route('user.store'),
        ]);
    }

    /**
     * Create a new user.
     */
    public function store(UserCreateRequest $request)
    {
        $userRequest = $request->all();
        $userRequest["productive_unit_id"] = Auth::user()->productive_unit_id;
        User::create($userRequest);
    }

    /**
     * Display the user's profile form.
     */
    public function edit($userId): Response
    {
        $user = User::where('id', $userId)->first();
        $roles = Role::where('id', '>', 1)->get();

        return \inertia('Users/Create', [
            'user' => $user,
            'roles' => $roles,
            'usersUrl' => url('/users'),
            'formActionUrl' => route('user.update', ['userId' => $userId]),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(UserUpdateRequest $request, $userId)
    {
        $userRequest = $request->all();
        User::where('id', $userId)->update($userRequest);
    }

    /**
     * Display the user's profile information.
     */
    public function view($userId)
    {
        $loggedUser = User::with('role')->find(Auth::id());
        $user = User::with('role')->find($userId);
        $envRoles = EnvHelper::getRoles();

        if($user){
            return \inertia('Users/View', [
                'loggedUser' => $loggedUser,
                'user' => $user,
                'envRoles' => $envRoles,
                'csrfToken' => csrf_token()
            ]);
        }
        else {
            return Redirect::route('users');
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request, $userId)
    {
        // Get the logged user instance
        $loggedUser = Auth::user();
        // Get the user is supposed to be deleted
        $user = User::where('id', $userId)
            ->where('productive_unit_id', $loggedUser->productive_unit_id)
            ->first();

        // If the user exists
        if($user){
            // Do the soft delete
            if($user->delete()){
                if($loggedUser->id === $user->id){
                    Auth::logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();
                }
                // Return a confirmation message
                return response()->json(["msg" => "Usuario eliminado satisfactoriamente"], 200);
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return response()->json(["msg" => "No ha sido posible eliminar el usuario"], 500);
            }
        }
        else {
            // If the user doesn't exist
            return response()->json(["msg" => "El usuario no existe"], 404);
        }
    }
}
