angular.module('todoApp', [])
    .controller('TodoController', ['$scope', function($scope) {
        // Load data from localStorage
        var data = JSON.parse(localStorage.getItem('todoData')) || {todos: [], undoTodos: []};
        $scope.todos = data.todos;
        $scope.newTodo = '';
        $scope.query = '';
        $scope.statusFilter = 'all';  // 'all', 'active', 'completed'
        $scope.editingIndex = -1;
        $scope.editText = '';
        $scope.undoTodos = data.undoTodos;

        $scope.filteredTodos = function() {
            return $scope.todos.filter(function(todo) {
                var matchesQuery = !$scope.query || todo.text.toLowerCase().includes($scope.query.toLowerCase());
                var matchesStatus = $scope.statusFilter === 'all' || 
                                   ($scope.statusFilter === 'active' && !todo.completed) ||
                                   ($scope.statusFilter === 'completed' && todo.completed);
                return matchesQuery && matchesStatus;
            });
        };

        $scope.activeTodosCount = function() {
            return $scope.todos.filter(function(todo) { return !todo.completed; }).length;
        };

$scope.addTodo = function() {
            if ($scope.newTodo.trim()) {
                $scope.todos.push({
                    text: $scope.newTodo.trim(),
                    completed: false
                });
                $scope.newTodo = '';
                $scope.saveData();
            }
        };

        $scope.handleEditKey = function(event, index) {
            if (event.keyCode === 13) { // Enter
                $scope.saveEdit(index);
            } else if (event.keyCode === 27) { // Escape
                $scope.cancelEdit();
            }
        };

        $scope.editTodo = function(index) {
            $scope.editingIndex = index;
            $scope.editText = $scope.todos[index].text;
        };

        $scope.saveEdit = function(index) {
            if ($scope.editText.trim()) {
                $scope.todos[index].text = $scope.editText.trim();
                $scope.saveData();
            }
            $scope.cancelEdit();
        };

        $scope.cancelEdit = function() {
            $scope.editingIndex = -1;
            $scope.editText = '';
        };

        $scope.removeTodo = function(index) {
            // Push to undo stack
            $scope.undoTodos.push($scope.todos[index]);
            if ($scope.undoTodos.length > 5) $scope.undoTodos.shift();  // Limit undo stack
            $scope.todos.splice(index, 1);
            $scope.saveData();
        };

        $scope.clearCompleted = function() {
            $scope.todos = $scope.todos.filter(function(todo) { return !todo.completed; });
            $scope.saveData();
        };

        $scope.undoLast = function() {
            if ($scope.undoTodos.length) {
                $scope.todos.push($scope.undoTodos.pop());
                $scope.saveData();
            }
        };

        $scope.saveData = function() {
            localStorage.setItem('todoData', JSON.stringify({
                todos: $scope.todos,
                undoTodos: $scope.undoTodos
            }));
        };

        // Auto-save on changes
        $scope.$watch('todos', $scope.saveData, true);
        $scope.$watch('undoTodos', $scope.saveData, true);
    }]);

